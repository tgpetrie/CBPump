// Advanced caching utilities with stale-while-revalidate strategy
// CBMo4ers Crypto Dashboard - Production-ready caching

/**
 * Cache configuration
 */
const CACHE_CONFIG = {
  // Cache TTL in milliseconds
  DEFAULT_TTL: 60 * 1000, // 1 minute
  STALE_TTL: 5 * 60 * 1000, // 5 minutes (stale-while-revalidate window)
  
  // Cache keys
  KEYS: {
    MARKET_DATA: 'market_data',
    HEALTH_CHECK: 'health_check',
    CHART_DATA: 'chart_data',
    COMPONENT_DATA: 'component_data'
  },
  
  // Storage type
  STORAGE: 'localStorage', // 'localStorage', 'sessionStorage', or 'memory'
  
  // Maximum cache entries
  MAX_ENTRIES: 100
};

/**
 * Cache storage adapter
 */
class CacheStorage {
  constructor(type = CACHE_CONFIG.STORAGE) {
    this.type = type;
    this.memoryStore = new Map();
  }

  get(key) {
    try {
      switch (this.type) {
        case 'localStorage':
          return localStorage.getItem(key);
        case 'sessionStorage':
          return sessionStorage.getItem(key);
        case 'memory':
        default:
          return this.memoryStore.get(key);
      }
    } catch (error) {
      console.warn('Cache storage get error:', error);
      return null;
    }
  }

  set(key, value) {
    try {
      // Enforce max entries
      if (this.type === 'memory' && this.memoryStore.size >= CACHE_CONFIG.MAX_ENTRIES) {
        const firstKey = this.memoryStore.keys().next().value;
        this.memoryStore.delete(firstKey);
      }

      switch (this.type) {
        case 'localStorage':
          localStorage.setItem(key, value);
          break;
        case 'sessionStorage':
          sessionStorage.setItem(key, value);
          break;
        case 'memory':
        default:
          this.memoryStore.set(key, value);
          break;
      }
    } catch (error) {
      console.warn('Cache storage set error:', error);
    }
  }

  remove(key) {
    try {
      switch (this.type) {
        case 'localStorage':
          localStorage.removeItem(key);
          break;
        case 'sessionStorage':
          sessionStorage.removeItem(key);
          break;
        case 'memory':
        default:
          this.memoryStore.delete(key);
          break;
      }
    } catch (error) {
      console.warn('Cache storage remove error:', error);
    }
  }

  clear() {
    try {
      switch (this.type) {
        case 'localStorage':
          // Only clear our cache keys
          Object.values(CACHE_CONFIG.KEYS).forEach(key => {
            localStorage.removeItem(key);
          });
          break;
        case 'sessionStorage':
          Object.values(CACHE_CONFIG.KEYS).forEach(key => {
            sessionStorage.removeItem(key);
          });
          break;
        case 'memory':
        default:
          this.memoryStore.clear();
          break;
      }
    } catch (error) {
      console.warn('Cache storage clear error:', error);
    }
  }
}

/**
 * Advanced cache entry with metadata
 */
class CacheEntry {
  constructor(data, ttl = CACHE_CONFIG.DEFAULT_TTL) {
    this.data = data;
    this.timestamp = Date.now();
    this.ttl = ttl;
    this.accessCount = 0;
    this.lastAccessed = this.timestamp;
  }

  isValid() {
    return Date.now() - this.timestamp < this.ttl;
  }

  isStale() {
    return Date.now() - this.timestamp > this.ttl;
  }

  isExpired() {
    return Date.now() - this.timestamp > (this.ttl + CACHE_CONFIG.STALE_TTL);
  }

  access() {
    this.accessCount++;
    this.lastAccessed = Date.now();
    return this.data;
  }

  toJSON() {
    return {
      data: this.data,
      timestamp: this.timestamp,
      ttl: this.ttl,
      accessCount: this.accessCount,
      lastAccessed: this.lastAccessed
    };
  }

  static fromJSON(json) {
    const entry = new CacheEntry(json.data, json.ttl);
    entry.timestamp = json.timestamp;
    entry.accessCount = json.accessCount || 0;
    entry.lastAccessed = json.lastAccessed || json.timestamp;
    return entry;
  }
}

/**
 * Advanced cache manager with stale-while-revalidate
 */
class CacheManager {
  constructor() {
    this.storage = new CacheStorage();
    this.revalidationPromises = new Map();
  }

  /**
   * Get data from cache with stale-while-revalidate strategy
   */
  async get(key, fetchFunction, options = {}) {
    const { ttl = CACHE_CONFIG.DEFAULT_TTL, forceRefresh = false } = options;
    
    // Return fresh data if force refresh
    if (forceRefresh) {
      return this._fetchAndCache(key, fetchFunction, ttl);
    }

    // Try to get from cache
    const cachedData = this._getFromCache(key);
    
    if (cachedData) {
      const entry = cachedData;
      
      if (entry.isValid()) {
        // Cache hit - return fresh data
        console.log(`🎯 Cache hit (fresh): ${key}`);
        return {
          data: entry.access(),
          source: 'cache-fresh',
          timestamp: entry.timestamp
        };
      } else if (!entry.isExpired()) {
        // Stale but not expired - return stale data and revalidate in background
        console.log(`🔄 Cache hit (stale): ${key} - revalidating in background`);
        
        // Start background revalidation if not already running
        if (!this.revalidationPromises.has(key)) {
          const revalidationPromise = this._fetchAndCache(key, fetchFunction, ttl)
            .finally(() => {
              this.revalidationPromises.delete(key);
            });
          this.revalidationPromises.set(key, revalidationPromise);
        }
        
        return {
          data: entry.access(),
          source: 'cache-stale',
          timestamp: entry.timestamp,
          revalidating: true
        };
      }
    }

    // Cache miss or expired - fetch fresh data
    console.log(`❌ Cache miss: ${key}`);
    return this._fetchAndCache(key, fetchFunction, ttl);
  }

  /**
   * Set data in cache
   */
  set(key, data, ttl = CACHE_CONFIG.DEFAULT_TTL) {
    const entry = new CacheEntry(data, ttl);
    this.storage.set(key, JSON.stringify(entry.toJSON()));
  }

  /**
   * Remove data from cache
   */
  remove(key) {
    this.storage.remove(key);
  }

  /**
   * Clear all cache
   */
  clear() {
    this.storage.clear();
    this.revalidationPromises.clear();
  }

  /**
   * Get cache statistics
   */
  getStats() {
    const stats = {
      entries: 0,
      totalSize: 0,
      freshEntries: 0,
      staleEntries: 0,
      expiredEntries: 0
    };

    Object.values(CACHE_CONFIG.KEYS).forEach(key => {
      const entry = this._getFromCache(key);
      if (entry) {
        stats.entries++;
        stats.totalSize += JSON.stringify(entry.data).length;
        
        if (entry.isValid()) {
          stats.freshEntries++;
        } else if (!entry.isExpired()) {
          stats.staleEntries++;
        } else {
          stats.expiredEntries++;
        }
      }
    });

    return stats;
  }

  /**
   * Private method to get data from cache storage
   */
  _getFromCache(key) {
    try {
      const cached = this.storage.get(key);
      if (cached) {
        return CacheEntry.fromJSON(JSON.parse(cached));
      }
    } catch (error) {
      console.warn(`Cache get error for key ${key}:`, error);
      this.remove(key); // Remove corrupted cache entry
    }
    return null;
  }

  /**
   * Private method to fetch and cache data
   */
  async _fetchAndCache(key, fetchFunction, ttl) {
    try {
      const startTime = Date.now();
      const result = await fetchFunction();
      const fetchTime = Date.now() - startTime;
      
      if (result.success) {
        this.set(key, result.data, ttl);
        console.log(`✅ Cache updated: ${key} (fetch time: ${fetchTime}ms)`);
        
        return {
          data: result.data,
          source: 'fetch',
          timestamp: Date.now(),
          fetchTime
        };
      } else {
        console.warn(`⚠️ Fetch failed for ${key}:`, result.error);
        
        // Try to return stale data if available
        const staleData = this._getFromCache(key);
        if (staleData && !staleData.isExpired()) {
          console.log(`🔄 Using stale data due to fetch failure: ${key}`);
          return {
            data: staleData.access(),
            source: 'cache-stale-fallback',
            timestamp: staleData.timestamp,
            error: result.error
          };
        }
        
        throw new Error(result.error || 'Fetch failed');
      }
    } catch (error) {
      console.error(`💥 Cache fetch error for ${key}:`, error);
      
      // Try to return stale data as last resort
      const staleData = this._getFromCache(key);
      if (staleData) {
        console.log(`🆘 Using expired data as last resort: ${key}`);
        return {
          data: staleData.access(),
          source: 'cache-expired-fallback',
          timestamp: staleData.timestamp,
          error: error.message
        };
      }
      
      throw error;
    }
  }
}

// Create global cache manager instance
const cacheManager = new CacheManager();

// Export cache utilities
export {
  cacheManager,
  CacheManager,
  CacheEntry,
  CacheStorage,
  CACHE_CONFIG
};

// Export convenience functions
export const getCachedData = (key, fetchFunction, options) => 
  cacheManager.get(key, fetchFunction, options);

export const setCachedData = (key, data, ttl) => 
  cacheManager.set(key, data, ttl);

export const removeCachedData = (key) => 
  cacheManager.remove(key);

export const clearCache = () => 
  cacheManager.clear();

export const getCacheStats = () => 
  cacheManager.getStats();
