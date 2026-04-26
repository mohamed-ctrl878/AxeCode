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
        // this.price = formData.price; // {number}

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
        // Defensive: ensure tags is an array of clean strings. 
        // Prevents corruption if objects or "[object Object]" fragments leak through.
        const cleanTags = (Array.isArray(this.tags) ? this.tags : [])
            .map(t => {
                if (typeof t === 'string') return t;
                if (!t) return "";
                return t.name || t.label || String(t);
            })
            .filter(t => t && t !== "[object Object]");

        return {
            data: {
                title: this.title,
                description: this.description,
                difficulty: this.difficulty,
                picture: this.picture || null,
                tags: cleanTags,
                price: this.price,
                isDraft: !!this.isDraft, // Force boolean
                course_types: Array.isArray(this.course_types) ? this.course_types : [],
                problem_types: Array.isArray(this.problem_types) ? this.problem_types : []
            }
        };
    }
}
