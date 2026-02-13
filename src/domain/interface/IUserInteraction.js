import { IInteraction } from './IInteraction';

/**
 * @interface IUserInteraction
 * @extends IInteraction
 */
export class IUserInteraction extends IInteraction {
    /**
     * @param {string|number} userId 
     * @param {object} settings 
     * @returns {Promise<any>}
     */
    async updateSettings(userId, settings) {
        throw new Error("Method 'updateSettings' must be implemented.");
    }
}
