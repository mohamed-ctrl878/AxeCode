import { IAccess } from './IAccess';

/**
 * @interface IProblemAccess
 * @extends IAccess
 */
export class IProblemAccess extends IAccess {
    /**
     * @returns {Promise<any[]>}
     */
    async getProblemTypes() {
        throw new Error("Method 'getProblemTypes' must be implemented.");
    }

    /**
     * @param {string|number} problemId 
     * @returns {Promise<any[]>}
     */
    async getTestCases(problemId) {
        throw new Error("Method 'getTestCases' must be implemented.");
    }
}
