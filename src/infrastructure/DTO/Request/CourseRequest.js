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
        this.price = formData.price; // {number}

        // Relationship IDs
        this.course_types = formData.courseTypeIds || []; // {Array<number>}
        this.problem_types = formData.problemTypeIds || []; // {Array<number>}
        this.isDraft = formData.isDraft ?? true; // {boolean}
    }

    /**
     * Validates required fields before sending to server.
     * @throws {Error}
     */
    validate() {
        super.validate();
        // Validation is relaxed to allow partial updates or DTOs with pre-filled minor missing fields.
        // Usually, the presentation layer handles mandatory field checks for Create.
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
                picture: this.picture || null,
                tags: this.tags,
                price: this.price,
                isDraft: this.isDraft
            }
        };
    }
}
