import { IInteraction } from './IInteraction';

/**
 * @interface ILiveStreamInteraction
 * @extends IInteraction
 */
export class ILiveStreamInteraction extends IInteraction {
    /**
     * @param {string|number} streamId 
     */
    async startStream(streamId) {
        throw new Error("Method 'startStream' must be implemented.");
    }

    /**
     * @param {string|number} streamId 
     */
    async endStream(streamId) {
        throw new Error("Method 'endStream' must be implemented.");
    }
}
