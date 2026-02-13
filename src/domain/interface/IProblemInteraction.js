import { IInteraction } from './IInteraction';

/**
 * @interface IProblemInteraction
 * @extends IInteraction
 */
export class IProblemInteraction extends IInteraction {
    /**
     * @param {string|number} problemId 
     * @param {object} solution 
     */
    async submitSolution(problemId, solution) {
        throw new Error("Method 'submitSolution' must be implemented.");
    }
}
