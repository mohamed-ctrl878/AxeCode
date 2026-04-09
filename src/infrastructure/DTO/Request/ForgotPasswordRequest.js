import { BaseRequest } from './BaseRequest';
import { SecurityUtils } from '../../../core/utils/SecurityUtils';

/**
 * ForgotPasswordRequest: DTO for password recovery initialization.
 */
export class ForgotPasswordRequest extends BaseRequest {
    constructor(formData = {}) {
        super();
        this.email = formData.email || '';
    }

    toPayload() {
        return {
            email: SecurityUtils.sanitizeData(this.email.toLowerCase().trim())
        };
    }

    validate() {
        if (!this.email) {
            throw new Error("Email is required for identity recovery.");
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(this.email)) {
            throw new Error("Invalid email format.");
        }
    }
}
