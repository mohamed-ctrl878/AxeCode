import { BaseRequest } from './BaseRequest';
import { SecurityUtils } from '../../../core/utils/SecurityUtils';

/**
 * LoginRequest: DTO for user authentication.
 * Follows SRP: Responsible for login data modeling and validation.
 */
export class LoginRequest extends BaseRequest {
    constructor(formData = {}) {
        super();
        this.identifier = formData.identifier || ''; // Email or Username
        this.password = formData.password || '';
        this.recaptchaToken = formData.recaptchaToken || '';
    }

    /**
     * Override toPayload: Strapi expects flat object.
     */
    toPayload() {
        const payload = {};
        Object.keys(this).forEach(key => {
            const value = this[key];
            if (value !== undefined && value !== null && value !== '') {
                payload[key] = SecurityUtils.sanitizeData(value);
            }
        });
        return payload;
    }

    /**
     * Validation for login.
     */
    validate() {
        super.validate();

        if (!this.identifier) {
            throw new Error("Identifier (email or username) is required.");
        }

        if (!this.password) {
            throw new Error("Password is required.");
        }

        if (!this.recaptchaToken) {
            throw new Error("Security verification (reCAPTCHA) is required.");
        }
    }
}
