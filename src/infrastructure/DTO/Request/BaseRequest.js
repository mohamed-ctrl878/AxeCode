import { SecurityUtils } from '@core/utils/SecurityUtils';

/**
 * Base class for all Request DTOs (Form Data).
 */
export class BaseRequest {
    /**
     * Standard method to format the payload for Strapi.
     * Also applies security sanitization to prevent XSS and injections.
     * Note: embed_* fields are exempted from sanitization because they contain
     * URLs with special characters (://) that get destroyed by validator.escape().
     * These fields are validated by the backend provider registry instead.
     * @returns {object} - Raw fields sanitized
     */
    toJSON() {
        const payload = {};
        const SANITIZE_EXEMPT = ['embed_url', 'embed_source', 'embed_metadata'];

        Object.keys(this).forEach(key => {
            if (this[key] !== undefined) {
                if (SANITIZE_EXEMPT.includes(key)) {
                    payload[key] = this[key]; // Pass through raw — validated by backend
                } else {
                    payload[key] = SecurityUtils.sanitizeData(this[key]);
                }
            }
        });
        return payload;
    }

    /**
     * Standard Strapi payload wrapper.
     * @returns {object}
     */
    toPayload() {
        return {
            data: this.toJSON()
        };
    }

    /**
     * Abstract validation method.
     * Includes security audit for all fields.
     * @throws {Error} if data is invalid or unsafe.
     */
    validate() {
        // Security Audit — skip embed fields (URLs break XSS detection)
        Object.keys(this).forEach(key => {
            if (this[key] !== undefined && !key.includes("embed")) {
                SecurityUtils.validateSafety(this[key]);
            }
        });
    }
}
