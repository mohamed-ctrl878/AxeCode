import { BaseRequest } from './BaseRequest';

/**
 * Request DTO for Course creation/update.
 */
export class CourseRequest extends BaseRequest {
    constructor(formData = {}) {
        super();
        this.title = formData.title; // {string}
        this.description = formData.description; // {Blocks array}
        this.difficulty = formData.difficulty; // {string}
        
        // Relationship IDs
        this.course_types = formData.courseTypeIds || []; // {Array<number>}
        this.problem_types = formData.problemTypeIds || []; // {Array<number>}

        // Optional Entitlement context
        // this.entitlement = formData.entitlement || null; // {EntitlementRequest}
    }

    /**
     * Validates required fields before sending to server.
     * @throws {Error}
     */
    validate() {
        super.validate();
        if (!this.title || this.title.trim().length === 0) {
            throw new Error("Course title is required.");
        }
        if (!['Easy', 'Medium', 'Advanced', 'Rasy'].includes(this.difficulty)) {
            // Include 'Rasy' if the backend still expects it, or map it here.
        }
    }
}
