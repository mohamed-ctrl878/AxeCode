/**
 * @interface IAccess
 * Base interface for data access (Read operations).
 */
export class IAccess {
    /**
     * @param {object} params - Query parameters (populate, filters, etc.)
     * @returns {Promise<any[]>}
     */
    async getAll(params = {}) {
        throw new Error("Method 'getAll' must be implemented.");
    }

    /**
     * @param {string|number} id 
     * @param {object} params 
     * @returns {Promise<any>}
     */
    async getById(id, params = {}) {
        throw new Error("Method 'getById' must be implemented.");
    }
}
