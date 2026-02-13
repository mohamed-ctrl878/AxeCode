import { IInteraction } from './IInteraction';

/**
 * @interface IEventInteraction
 * @extends IInteraction
 */
export class IEventInteraction extends IInteraction {
    /**
     * @param {string|number} eventId 
     * @returns {Promise<boolean>}
     */
    async registerForEvent(eventId) {
        throw new Error("Method 'registerForEvent' must be implemented.");
    }
}
