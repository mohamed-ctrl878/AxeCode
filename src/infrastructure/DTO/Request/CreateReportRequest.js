import { BaseRequest } from './BaseRequest';

/**
 * Request DTO for reporting content or users.
 */
export class CreateReportRequest extends BaseRequest {
    constructor(data = {}) {
        super();
        this.description = data.description;
        this.content_type = data.contentType;
        this.docId = data.docId;
        this.reported_user = data.reportedUserId;
        this.report_types = data.reportTypeIds || [];
        this.screans = data.screenIds || []; // Preserve typo
    }

    validate() {
        super.validate();
        if (!this.description) throw new Error("Report description is required.");
        if (!this.content_type && !this.reported_user) {
            throw new Error("Report must target either content or a user.");
        }
    }
}
