import { IInteraction } from './IInteraction';

/**
 * @interface IContentInteraction
 * @extends IInteraction
 */
export class IContentInteraction extends IInteraction {
    /**
     * @param {string|number} contentId 
     * @returns {Promise<any>}
     */
    async trackEngagement(contentId) {
        throw new Error("Method 'trackEngagement' must be implemented.");
    }

    /**
     * @param {string|number} contentId 
     * @param {string} contentType 
     */
    async like(contentId, contentType) {
        throw new Error("Method 'like' must be implemented.");
    }

    /**
     * @param {string|number} contentId 
     * @param {string} contentType 
     * @param {object} commentData 
     */
    async comment(contentId, contentType, commentData) {
        throw new Error("Method 'comment' must be implemented.");
    }
}
