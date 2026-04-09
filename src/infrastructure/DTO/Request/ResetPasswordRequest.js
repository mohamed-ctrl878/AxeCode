import { BaseRequest } from './BaseRequest';
import { SecurityUtils } from '../../../core/utils/SecurityUtils';

/**
 * ResetPasswordRequest: DTO for final password update protocol via OTP.
 */
export class ResetPasswordRequest extends BaseRequest {
    constructor(formData = {}) {
        super();
        this.email = formData.email || '';
        this.code = formData.code || ''; // 6-digit OTP
        this.password = formData.password || '';
        this.confirmPassword = formData.confirmPassword || '';
    }

    toPayload() {
        return {
            email: SecurityUtils.sanitizeData(this.email.toLowerCase().trim()),
            code: SecurityUtils.sanitizeData(this.code.trim()),
            password: this.password
        };
    }

    validate() {
        if (!this.email) throw new Error("Email reference is required.");
        if (!this.code || this.code.length !== 6) throw new Error("A valid 6-digit verification code is required.");
        if (!this.password || this.password.length < 8) throw new Error("New password must be at least 8 characters long.");
        if (this.password !== this.confirmPassword) throw new Error("Passwords do not match.");
    }
}
