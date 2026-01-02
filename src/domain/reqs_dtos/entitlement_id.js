export class entitlement_id {
    constructor(data) {
        this.productId = data?.entitlementId;
        this.content_types = data.content_types
    }
}