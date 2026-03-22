/**
 * Request DTO for creating an Entitlement (Access Rule).
 */
export class EntitlementRequest {
    constructor({
        title = '',
        description = '',
        price = 0,
        currency = 'USD',
        decision = true,
        duration = null,
        itemId = '',
        contentType = 'course',
        userId = null
    } = {}) {
        this.title = title;
        this.description = description;
        this.price = price;
        this.currency = currency;
        this.decision = decision;
        this.duration = duration;
        this.itemId = itemId;
        this.content_types = contentType;
        this.users_permissions_user = userId;
    }

    /**
     * Converts to JSON for Strapi body.
     */
    toJSON() {
        return {
            title: this.title,
            description: this.description,
            price: this.price,
            currency: this.currency,
            decision: this.decision,
            duration: this.duration,
            itemId: this.itemId,
            content_types: this.content_types,
            users_permissions_user: this.users_permissions_user
        };
    }
}
