import { BaseRequest } from './BaseRequest';

/**
 * Request DTO for Analytics (High -> Low)
 */
export class CMSAnalyticsRequest extends BaseRequest {
    constructor(data = {}) {
        super(data);
        this.days = Number(data.days) || 60;
    }

    toQueryString() {
        return `?days=${this.days}`;
    }
}
