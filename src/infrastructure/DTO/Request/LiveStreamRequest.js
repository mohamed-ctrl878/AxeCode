import { BaseRequest } from './BaseRequest';

/**
 * Request DTO for LiveStream creation/update.
 */
export class LiveStreamRequest extends BaseRequest {
    constructor(data = {}) {
        super();
        this.title = data.title;
        this.description = data.description;
        this.status = data.status || 'scheduled'; // Enum: scheduled, live, ended, cancelled
        this.scheduledAt = data.scheduledAt;
        this.tags = data.tagIds || [];
        this.category = data.category;
    }

    validate() {
        super.validate();
        if (!this.title) throw new Error("LiveStream title is required.");
    }
}
