import { SecurityUtils } from '../utils/SecurityUtils';

/**
 * Base class for all Request DTOs (Form Data).
 */
export class BaseRequest {
    /**
     * Standard method to format the payload for Strapi.
     * Also applies security sanitization to prevent XSS and injections.
     * @returns {object} - { data: { ... } }
     */
    toPayload() {
        const payload = {};
        Object.keys(this).forEach(key => {
            if (this[key] !== undefined) {
                // Apply sanitization to all outgoing data
                payload[key] = SecurityUtils.sanitizeData(this[key]);
            }
        });
        return { data: payload };
    }

    /**
     * Abstract validation method.
     * Includes security audit for all fields.
     * @throws {Error} if data is invalid or unsafe.
     */
    validate() {
        // Security Audit
        Object.keys(this).forEach(key => {
            if (this[key] !== undefined) {
                SecurityUtils.validateSafety(this[key]);
            }
        });
    }
}
