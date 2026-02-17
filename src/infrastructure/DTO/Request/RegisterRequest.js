import { BaseRequest } from './BaseRequest';
import { SecurityUtils } from '../../../core/utils/SecurityUtils';

/**
 * RegisterRequest: DTO for user registration.
 * Encapsulates registration data and validation logic.
 * Note: Username and Email availability should be checked via useUserAvailability hook 
 * during the form filling process or before submission.
 * Follows SRP: Responsible only for registration data modeling.
 */
export class RegisterRequest extends BaseRequest {
    constructor(formData = {}) {
        super();
        this.username = formData.username || '';
        this.email = formData.email || '';
        this.password = formData.password || '';
        this.firstname = formData.firstname || '';
        this.lastname = formData.lastname || '';
        this.phone = formData.phone || '';
        this.birthday = formData.birthday || '';
        this.university = formData.university || '';
        this.recaptchaToken = formData.recaptchaToken || '';
    }

    /**
     * Override toPayload: Registration endpoint expects a flat object,
     * not wrapped in { data: { ... } }.
     */
    toPayload() {
        const payload = {};
        Object.keys(this).forEach(key => {
            const value = this[key];
            // Only include non-empty values in the payload
            if (value !== undefined && value !== null && value !== '') {
                payload[key] = SecurityUtils.sanitizeData(value);
            }
        });
        return payload;
    }

    /**
     * Validation logic for registration.
     */
    validate() {
        super.validate();

        // 1. Required Fields
        if (!this.username) throw new Error("Username is required.");
        if (!this.email) throw new Error("Email is required.");
        if (!this.password) throw new Error("Password is required.");

        // 2. Email Format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(this.email)) {
            throw new Error("Invalid email format.");
        }

        // 3. Password Strength (Minimum 8 characters)
        if (this.password.length < 8) {
            throw new Error("Password must be at least 8 characters long.");
        }

        // 4. Phone Format (Optional validation if provided)
        if (this.phone && !/^\+?[0-9]{10,15}$/.test(this.phone)) {
            throw new Error("Invalid phone number format.");
        }

        // 5. Security Verification
        if (!this.recaptchaToken) {
            throw new Error("Security verification (reCAPTCHA) is required.");
        }

        // 6. Birthday Format (yyyy-MM-dd)
        if (this.birthday && !/^\d{4}-\d{2}-\d{2}$/.test(this.birthday)) {
            throw new Error("Birthday must be in yyyy-MM-dd format.");
        }
    }
}
