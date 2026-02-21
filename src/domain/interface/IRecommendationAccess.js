import { IAccess } from './IAccess';

/**
 * @interface IRecommendationAccess
 * @extends IAccess
 * Contract for accessing recommendation data.
 */
export class IRecommendationAccess extends IAccess {
    /**
     * @param {number} [limit]
     * @returns {Promise<any[]>}
     */
    async getCourses(limit) {
        throw new Error("Method 'getCourses' must be implemented.");
    }

    /**
     * @param {number} [limit]
     * @returns {Promise<any[]>}
     */
    async getEvents(limit) {
        throw new Error("Method 'getEvents' must be implemented.");
    }
}
