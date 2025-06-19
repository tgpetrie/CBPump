// Centralized API calls for the frontend

// Centralized API calls for the frontend

// Determine the correct API base URL based on environment
const getApiBaseUrl = () => {
  // In production (Vercel), use the same domain for API calls
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
    return window.location.origin;
  }
  // In development, use the environment variable or default to localhost
  return import.meta.env.VITE_API_URL || 'http://localhost:5003';
};

const API_BASE_URL = getApiBaseUrl();

export const fetchMarketData = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/crypto`);
        if (!response.ok) {
            throw new Error('Failed to fetch market data');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching market data:', error);
        throw error;
    }
};

export const fetchCoinDetails = async (coinId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/chart/${coinId}`);
        if (!response.ok) {
            throw new Error('Failed to fetch coin details');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching coin details:', error);
        throw error;
    }
};
