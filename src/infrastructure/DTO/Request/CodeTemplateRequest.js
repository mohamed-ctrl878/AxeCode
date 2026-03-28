import { BaseRequest } from './BaseRequest';

/**
 * Request DTO for Problem Code Template.
 */
export class CodeTemplateRequest extends BaseRequest {
    constructor(data = {}) {
        super();
        this.language = data.language; // Enum: python, java, javascript, cpp
        this.starterCode = data.starterCode || '';
        this.wrapperCode = data.wrapperCode || '';
        this.problem = data.problemId; // documentId
    }

    validate() {
        super.validate();
        if (!this.language) throw new Error("Language is required for code templates.");
        if (!this.starterCode) throw new Error("Starter code is required.");
        if (!this.wrapperCode) throw new Error("Wrapper code is required.");
        if (!this.problem) throw new Error("Template must be linked to a problem.");
    }
}
