import { IAccess } from './IAccess';

/**
 * @interface IContentAccess
 * @extends IAccess
 */
export class IContentAccess extends IAccess {
    /**
     * @param {string} contentType 
     * @param {object} params 
     */
    async getByContentType(contentType, params = {}) {
        throw new Error("Method 'getByContentType' must be implemented.");
    }

    /**
     * @param {string|number} contentId 
     * @returns {Promise<any>}
     */
    async getEngagementStats(contentId) {
        throw new Error("Method 'getEngagementStats' must be implemented.");
    }
}
