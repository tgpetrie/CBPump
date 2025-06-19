// Enhanced API client with retry logic and error handling
// CBMo4ers Crypto Dashboard - Production-ready API utilities

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

// Retry configuration
const RETRY_CONFIG = {
  maxRetries: 3,
  baseDelay: 1000, // Start with 1 second
  maxDelay: 10000, // Cap at 10 seconds
  backoffMultiplier: 2
};

// Circuit breaker state
let circuitBreakerState = {
  failures: 0,
  lastFailureTime: null,
  isOpen: false,
  threshold: 5, // Open circuit after 5 failures
  timeout: 30000 // 30 seconds timeout
};

/**
 * Sleep utility for retry delays
 */
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Calculate exponential backoff delay
 */
const calculateDelay = (attempt) => {
  const delay = RETRY_CONFIG.baseDelay * Math.pow(RETRY_CONFIG.backoffMultiplier, attempt);
  return Math.min(delay, RETRY_CONFIG.maxDelay);
};

/**
 * Check if circuit breaker should allow requests
 */
const shouldAllowRequest = () => {
  if (!circuitBreakerState.isOpen) return true;
  
  const now = Date.now();
  const timeSinceLastFailure = now - circuitBreakerState.lastFailureTime;
  
  if (timeSinceLastFailure > circuitBreakerState.timeout) {
    // Reset circuit breaker - half-open state
    circuitBreakerState.isOpen = false;
    circuitBreakerState.failures = 0;
    return true;
  }
  
  return false;
};

/**
 * Record API failure for circuit breaker
 */
const recordFailure = () => {
  circuitBreakerState.failures++;
  circuitBreakerState.lastFailureTime = Date.now();
  
  if (circuitBreakerState.failures >= circuitBreakerState.threshold) {
    circuitBreakerState.isOpen = true;
    console.warn('🔌 Circuit breaker opened - API temporarily unavailable');
  }
};

/**
 * Record API success for circuit breaker
 */
const recordSuccess = () => {
  circuitBreakerState.failures = 0;
  circuitBreakerState.isOpen = false;
};

/**
 * Enhanced fetch with retry logic, circuit breaker, and timeout
 */
const fetchWithRetry = async (url, options = {}, attempt = 0) => {
  // Check circuit breaker
  if (!shouldAllowRequest()) {
    throw new Error('Circuit breaker is open - service temporarily unavailable');
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), options.timeout || 10000);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    recordSuccess();
    return response;

  } catch (error) {
    clearTimeout(timeoutId);
    
    // Don't retry on certain errors
    if (error.name === 'AbortError') {
      throw new Error('Request timeout');
    }
    
    if (attempt >= RETRY_CONFIG.maxRetries) {
      recordFailure();
      throw error;
    }

    // Calculate delay and retry
    const delay = calculateDelay(attempt);
    console.warn(`🔄 API request failed (attempt ${attempt + 1}/${RETRY_CONFIG.maxRetries + 1}), retrying in ${delay}ms...`);
    
    await sleep(delay);
    return fetchWithRetry(url, options, attempt + 1);
  }
};

/**
 * Make API request with enhanced error handling
 */
export const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  try {
    const response = await fetchWithRetry(url, options);
    const data = await response.json();
    
    return {
      success: true,
      data,
      error: null,
      status: response.status
    };
    
  } catch (error) {
    console.error(`❌ API Error for ${endpoint}:`, error.message);
    
    return {
      success: false,
      data: null,
      error: error.message,
      status: null
    };
  }
};

/**
 * Health check endpoint
 */
export const checkHealth = () => apiRequest('/api/health');

/**
 * Get market data with fallback and caching
 */
export const getMarketData = async () => {
  // Try individual component endpoints first (preferred)
  const endpoints = [
    '/api/component/top-banner-scroll',
    '/api/component/bottom-banner-scroll', 
    '/api/component/gainers-table',
    '/api/component/losers-table'
  ];

  const results = await Promise.allSettled(
    endpoints.map(endpoint => apiRequest(endpoint))
  );

  // Check if we have enough successful responses
  const successfulResponses = results.filter(result => 
    result.status === 'fulfilled' && result.value.success
  );

  if (successfulResponses.length >= 3) {
    // Combine successful responses
    return {
      success: true,
      data: successfulResponses.reduce((acc, result) => {
        const componentData = result.value.data;
        acc[componentData.component] = componentData;
        return acc;
      }, {}),
      error: null
    };
  }

  // Fallback to legacy combined endpoint
  console.warn('🔄 Falling back to legacy API endpoint');
  return apiRequest('/api/crypto');
};

/**
 * Get chart data for a specific symbol
 */
export const getChartData = (symbol) => apiRequest(`/api/chart/${symbol}`);

/**
 * Get watchlist data
 */
export const getWatchlist = () => apiRequest('/api/watchlist');

/**
 * Clear cache (admin function)
 */
export const clearCache = () => apiRequest('/api/clear-cache', { method: 'POST' });

/**
 * Get server info
 */
export const getServerInfo = () => apiRequest('/api/server-info');

// Export circuit breaker state for monitoring
export const getCircuitBreakerState = () => ({ ...circuitBreakerState });

// Export for debugging
export const resetCircuitBreaker = () => {
  circuitBreakerState = {
    failures: 0,
    lastFailureTime: null,
    isOpen: false,
    threshold: 5,
    timeout: 30000
  };
};
