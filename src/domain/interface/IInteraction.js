/**
 * @interface IInteraction
 * Base interface for interactions and mutations (Write operations).
 */
export class IInteraction {
    /**
     * @param {object} data 
     * @returns {Promise<any>}
     */
    async create(data) {
        throw new Error("Method 'create' must be implemented.");
    }

    /**
     * @param {string|number} id 
     * @param {object} data 
     * @returns {Promise<any>}
     */
    async update(id, data) {
        throw new Error("Method 'update' must be implemented.");
    }
}
