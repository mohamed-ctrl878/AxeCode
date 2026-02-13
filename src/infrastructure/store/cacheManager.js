/**
 * A utility for managing local storage caching.
 */

/**
 * Saves data to local storage with an optional expiration time.
 * 
 * @param {string} key - The key to store the data under.
 * @param {any} data - The data to store.
 * @param {number|null} ttl - Time to live in minutes (optional).
 */
export const saveToCache = (key, data, ttl = null) => {
    const cacheEntry = {
        data,
        timestamp: new Date().getTime(),
        ttl: ttl ? ttl * 60 * 1000 : null, // Convert minutes to milliseconds
    };
    localStorage.setItem(key, JSON.stringify(cacheEntry));
};

/**
 * Retrieves data from local storage, checking for expiration.
 * 
 * @param {string} key - The key to retrieve.
 * @returns {any|null} - The cached data or null if not found/expired.
 */
export const getFromCache = (key) => {
    const rawData = localStorage.getItem(key);
    if (!rawData) return null;

    try {
        const cacheEntry = JSON.parse(rawData);
        const { data, timestamp, ttl } = cacheEntry;

        if (ttl && (new Date().getTime() - timestamp > ttl)) {
            localStorage.removeItem(key); // Cleanup expired data
            return null;
        }

        return data;
    } catch (error) {
        console.error(`Error parsing cache for key "${key}":`, error);
        return null;
    }
};

/**
 * Removes data from local storage.
 * 
 * @param {string} key - The key to remove.
 */
export const removeFromCache = (key) => {
    localStorage.removeItem(key);
};

/**
 * Clears all cache entries managed by this utility (optional prefix filter).
 */
export const clearAllCache = () => {
    localStorage.clear();
};
