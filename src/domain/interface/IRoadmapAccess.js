import { IAccess } from './IAccess';

/**
 * @interface IRoadmapAccess
 * @extends IAccess
 */
export class IRoadmapAccess extends IAccess {
    /**
     * @param {string|number} roadmapId 
     */
    async getRoadmapFlow(roadmapId) {
        throw new Error("Method 'getRoadmapFlow' must be implemented.");
    }
}
