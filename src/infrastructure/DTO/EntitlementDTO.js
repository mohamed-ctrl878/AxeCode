import { BaseContentDTO } from './BaseContentDTO';

/**
 * DTO for Entitlement entity.
 * Represents pricing and access rules for content.
 */
export class EntitlementDTO extends BaseContentDTO {
    constructor(data = {}) {
        super(data);
        this.title = data.title; // {string}
        this.description = data.description; // {string}
        this.price = data.price; // {number}
        this.currency = data.currency || 'USD'; // {string}
        this.contentType = data.content_types; // {string} - Enum: role, course, uplive, upevent, veiwlive, veiwevent
        this.decision = !!data.decision; // {boolean}
        this.duration = data.duration ? new Date(data.duration) : null; // {Date | null}
        this.itemId = data.itemId; // {string} - Reference to the content documentId
        
        // Relationships
        this.userId = data.users_permissions_user?.id || data.users_permissions_user; // {number | string | null}
    }
}
