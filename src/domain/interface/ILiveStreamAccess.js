import { IAccess } from './IAccess';

/**
 * @interface ILiveStreamAccess
 * @extends IAccess
 */
export class ILiveStreamAccess extends IAccess {
    /**
     * @param {string|number} streamId 
     * @returns {Promise<number>}
     */
    async getViewerCount(streamId) {
        throw new Error("Method 'getViewerCount' must be implemented.");
    }

    /**
     * @param {string|number} streamId 
     */
    async getPlaylist(streamId) {
        throw new Error("Method 'getPlaylist' must be implemented.");
    }
}
