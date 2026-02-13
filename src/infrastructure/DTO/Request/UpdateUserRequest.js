import { BaseRequest } from './BaseRequest';
import { SecurityUtils } from '../utils/SecurityUtils';

/**
 * Request DTO for updating User profile data.
 */
export class UpdateUserRequest extends BaseRequest {
    constructor(formData = {}) {
        super();
        this.firstname = formData.firstname; // {string}
        this.lastname = formData.lastname; // {string}
        this.phone = formData.phone; // {string}
        this.university = formData.university; // {string}
        this.birthday = formData.birthday; // {string: ISO Date}
        this.interest_map = formData.interestMap; // {object}
    }

    /**
     * Custom toPayload because User updates in Strapi 
     * are often NOT wrapped in { data: { ... } } 
     * depending on the endpoint (Auth plugin vs Content Type).
     * We override if needed.
     */
    toPayload() {
        const payload = {};
        Object.keys(this).forEach(key => {
            if (this[key] !== undefined) {
                payload[key] = SecurityUtils.sanitizeData(this[key]);
            }
        });
        return payload; // Strapi Users-Permissions update usually doesn't want the "data" wrapper
    }

    validate() {
        super.validate();
        if (this.phone && !/^\+?[0-9]{10,15}$/.test(this.phone)) {
            throw new Error("Invalid phone number format.");
        }
    }
}
