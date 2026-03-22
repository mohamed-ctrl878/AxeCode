/**
 * Request DTO for creating a User Entitlement (Enrollment).
 */
export class UserEntitlementRequest {
    constructor({
        userId = null,
        productId = '',
        contentType = 'course',
        status = 'successed',
        startDate = new Date().toISOString(),
        duration = null
    } = {}) {
        this.users_permissions_user = userId;
        this.productId = productId;
        this.content_types = contentType;
        this.valid = status;
        this.strart = startDate; // Backend typo 'strart'
        this.duration = duration;
    }

    /**
     * Converts to JSON for Strapi body.
     */
    toJSON() {
        return {
            users_permissions_user: this.users_permissions_user,
            productId: this.productId,
            content_types: this.content_types,
            valid: this.valid,
            strart: this.strart,
            duration: this.duration
        };
    }
}
