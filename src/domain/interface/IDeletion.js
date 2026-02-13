/**
 * @interface IDeletion
 * Base interface for deletion operations.
 */
export class IDeletion {
    /**
     * @param {string|number} id 
     * @returns {Promise<boolean>}
     */
    async delete(id) {
        throw new Error("Method 'delete' must be implemented.");
    }
}
