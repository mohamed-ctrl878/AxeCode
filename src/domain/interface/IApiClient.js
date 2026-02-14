/**
 * @interface IApiClient
 * Unified interface for technical network operations.
 */
export class IApiClient {
    /**
     * @param {string} endpoint 
     * @param {object} data 
     * @returns {Promise<any>}
     */
    async post(endpoint, data) {
        throw new Error("Method 'post' must be implemented.");
    }

    /**
     * @param {string} endpoint 
     * @param {string|number} id 
     * @param {object} data 
     * @returns {Promise<any>}
     */
    async put(endpoint, id, data) {
        throw new Error("Method 'put' must be implemented.");
    }

    /**
     * @param {string} endpoint 
     * @param {FormData} formData 
     * @returns {Promise<any>}
     */
    async upload(endpoint, formData) {
        throw new Error("Method 'upload' must be implemented.");
    }

    /**
     * @param {string} endpoint 
     * @param {object} params 
     * @returns {Promise<any>}
     */
    async get(endpoint, params = {}) {
        throw new Error("Method 'get' must be implemented.");
    }
}
