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
        this.picture = formData.picture; // {number} Media ID
        this.tags = formData.tags || []; // {Array<string>}

        // Relationship IDs
        this.course_types = formData.courseTypeIds || []; // {Array<number>}
        this.problem_types = formData.problemTypeIds || []; // {Array<number>}
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
        if (!['Easy', 'Medium', 'Advanced'].includes(this.difficulty)) {
            throw new Error("Invalid difficulty level.");
        }
    }

    /**
     * Converts to Strapi-compatible payload.
     */
    toPayload() {
        return {
            data: {
                title: this.title,
                description: this.description,
                difficulty: this.difficulty,
                course_types: this.course_types,
                problem_types: this.problem_types,
                picture: this.picture || null,
                tags: this.tags
            }
        };
    }
}
