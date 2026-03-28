import { BaseRequest } from './BaseRequest';

/**
 * Request DTO for Problem Test Case.
 */
export class TestCaseRequest extends BaseRequest {
    constructor(data = {}) {
        super();
        this.input = data.input || {}; // JSON
        this.expectedOutput = data.expectedOutput || {}; // JSON
        this.isHidden = data.isHidden !== undefined ? data.isHidden : true;
        this.order = data.order || 0;
        this.problem = data.problemId; // documentId
    }

    validate() {
        super.validate();
        if (!this.input) throw new Error("Test case input is required.");
        if (!this.expectedOutput) throw new Error("Test case expected output is required.");
        if (!this.problem) throw new Error("Test case must be linked to a problem.");
    }
}
