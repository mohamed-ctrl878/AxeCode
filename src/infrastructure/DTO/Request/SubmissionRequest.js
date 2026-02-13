import { BaseRequest } from './BaseRequest';

/**
 * Request DTO for code submissions.
 */
export class SubmissionRequest extends BaseRequest {
    constructor(data = {}) {
        super();
        this.code = data.code; // {string}
        this.language = data.language; // {string} - Enum: python, java, javascript, cpp
        this.problem = data.problemId; // {string | number}
    }

    validate() {
        super.validate();
        if (!this.code) throw new Error("Code is required for submission.");
        if (!this.language) throw new Error("Language is required for submission.");
        if (!this.problem) throw new Error("Problem reference is required for submission.");
        
        const validLanguages = ['python', 'java', 'javascript', 'cpp'];
        if (!validLanguages.includes(this.language)) {
            throw new Error(`Invalid language. Supported: ${validLanguages.join(', ')}`);
        }
    }
}
