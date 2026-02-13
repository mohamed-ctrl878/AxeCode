import { BaseContentDTO } from './BaseContentDTO';
import { UserDTO } from './UserDTO';

/**
 * DTO for User Entitlement (Ownership record).
 */
export class UserEntitlementDTO extends BaseContentDTO {
    constructor(data = {}) {
        super(data);
        this.user = data.users_permissions_user ? new UserDTO(data.users_permissions_user) : null;
        this.startDate = data.strart ? new Date(data.strart) : null; // Backend typo 'strart'
        this.duration = data.duration ? new Date(data.duration) : null;
        this.contentType = data.content_types; // {string} - Enum: course, event, live
        this.productId = data.productId; // {string}
        this.status = data.valid; // {string} - Enum: pinding, successed, expired (Note: typos 'pinding', 'successed')
        
        this.isValid = this.status === 'successed';
    }
}
