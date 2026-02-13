import { BaseRequest } from './BaseRequest';

/**
 * Request DTO for Entitlement creation/update.
 */
export class EntitlementRequest extends BaseRequest {
    constructor(formData = {}) {
        super();
        this.title = formData.title;
        this.description = formData.description;
        this.price = formData.price;
        this.currency = formData.currency || 'USD';
        this.content_types = formData.contentType;
        this.decision = formData.decision ?? true;
        this.duration = formData.duration;
        this.itemId = formData.itemId;
    }

    validate() {
        super.validate();
        if (!this.price && this.price !== 0) {
            throw new Error("Price is required for entitlement.");
        }
        if (!this.content_types) {
            throw new Error("Content type is required for entitlement.");
        }
    }
}
