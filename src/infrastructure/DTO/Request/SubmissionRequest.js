import { BaseRequest } from './BaseRequest';
import { SecurityUtils } from '@core/utils/SecurityUtils';

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

    /**
     * Override toJSON to prevent code sanitization.
     */
    toJSON() {
        const payload = super.toJSON();
        // Restore raw code, bypassing HTML entity encoding in BaseRequest
        payload.code = this.code;
        return payload;
    }

    validate() {
        // Run security audit on everything EXCEPT code to prevent false positives
        // Use validation logic from BaseRequest but skip 'code'
        Object.keys(this).forEach(key => {
            if (this[key] !== undefined && key !== 'code') {
                SecurityUtils.validateSafety(this[key]);
            }
        });


        if (!this.code) throw new Error("Code is required for submission.");
        if (!this.language) throw new Error("Language is required for submission.");
        if (!this.problem) throw new Error("Problem reference is required for submission.");
        
        const validLanguages = ['python', 'java', 'javascript', 'cpp'];
        if (!validLanguages.includes(this.language)) {
            throw new Error(`Invalid language. Supported: ${validLanguages.join(', ')}`);
        }
    }
}

