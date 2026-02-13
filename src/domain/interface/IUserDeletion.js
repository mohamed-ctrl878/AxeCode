import { IDeletion } from './IDeletion';

/**
 * @interface IUserDeletion
 * @extends IDeletion
 */
export class IUserDeletion extends IDeletion {
    /**
     * @param {string|number} userId 
     * @returns {Promise<boolean>}
     */
    async deleteUser(userId) {
        throw new Error("Method 'deleteUser' must be implemented.");
    }
}
