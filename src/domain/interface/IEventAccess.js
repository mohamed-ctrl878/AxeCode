import { IAccess } from './IAccess';

/**
 * @interface IEventAccess
 * @extends IAccess
 */
export class IEventAccess extends IAccess {
    /**
     * @param {string|number} eventId 
     * @returns {Promise<any[]>}
     */
    async getSpeakers(eventId) {
        throw new Error("Method 'getSpeakers' must be implemented.");
    }

    /**
     * @param {string|number} eventId 
     * @returns {Promise<any[]>}
     */
    async getActivities(eventId) {
        throw new Error("Method 'getActivities' must be implemented.");
    }
}
