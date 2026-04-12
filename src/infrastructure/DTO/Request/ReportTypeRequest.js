import { BaseRequest } from './BaseRequest';

/**
 * Request DTO for managing Report Reasons (Report Types).
 */
export class ReportTypeRequest extends BaseRequest {
    constructor(data = {}) {
        super();
        this.type = data.type || '';
    }

    validate() {
        super.validate();
        if (!this.type || this.type.trim() === '') {
            throw new Error("Report reason type is required.");
        }
    }
}
