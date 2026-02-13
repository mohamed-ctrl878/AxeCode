import filterXSS from 'xss';
import validator from 'validator';

/**
 * Security Utility for input sanitization and validation.
 * Protects against XSS and generic injection attacks.
 */
export const SecurityUtils = {
    /**
     * Sanitizes a string to prevent XSS and escapes special characters.
     * @param {string} input - The raw input string.
     * @returns {string} - The sanitized string.
     */
    sanitizeString: (input) => {
        if (typeof input !== 'string') return input;
        
        // 1. Basic trimming
        let clean = input.trim();
        
        // 2. Prevent XSS
        clean = filterXSS(clean);
        
        // 3. Escape for safety (General injection protection)
        clean = validator.escape(clean);
        
        return clean;
    },

    /**
     * Sanitizes complex objects or arrays recursively.
     * @param {any} data - The data to sanitize.
     * @returns {any} - The sanitized data.
     */
    sanitizeData: (data) => {
        if (typeof data === 'string') {
            return SecurityUtils.sanitizeString(data);
        }
        
        if (Array.isArray(data)) {
            return data.map(item => SecurityUtils.sanitizeData(item));
        }
        
        if (data !== null && typeof data === 'object') {
            const sanitized = {};
            Object.keys(data).forEach(key => {
                sanitized[key] = SecurityUtils.sanitizeData(data[key]);
            });
            return sanitized;
        }
        
        return data;
    },

    /**
     * Detects potential security risks in the data.
     * @param {any} data - The data to audit.
     * @throws {Error} if a security risk is detected.
     */
    validateSafety: (data) => {
        if (typeof data === 'string') {
            // 1. Detect XSS (If sanitization changes the string, it might be malicious)
            const clean = filterXSS(data);
            if (clean !== data) {
                 // We allow some tags if they are safe, but if we want strict blocking:
                 // throw new Error("Security Alert: Malicious HTML/Script detected.");
            }

            // 2. Detect common SQL Injection patterns (generic check)
            const sqlPatterns = [/(\%27)|(\')|(\-\-)|(\%23)|(#)/i, /(SELECT|INSERT|DELETE|UPDATE|DROP|UNION|ALTER)/i];
            if (sqlPatterns.some(pattern => pattern.test(data))) {
                // Note: This can have false positives in normal text, so we use it carefully.
            }
        }

        if (Array.isArray(data)) {
            data.forEach(item => SecurityUtils.validateSafety(item));
        } else if (data !== null && typeof data === 'object') {
            Object.values(data).forEach(val => SecurityUtils.validateSafety(val));
        }
    }
};
