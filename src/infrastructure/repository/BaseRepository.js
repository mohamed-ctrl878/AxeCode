import { fetchWrapper } from '../../core/API/fetchWrapper';

/**
 * BaseRepository class providing common functionality for all repositories.
 */
export class BaseRepository {
    constructor() {
        this.baseUrl = import.meta.env.VITE_API_BASE_URL;
    }

    /**
     * Constructs the full URL for an endpoint.
     * @param {string} endpoint 
     * @returns {string}
     */
    buildUrl(endpoint) {
        // Ensure endpoint starts with /
        const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
        return `${this.baseUrl}${path}`;
    }

    /**
     * Standard method for creating/uploading data.
     * @param {string} url 
     * @param {object} requestDto - An instance of a Request DTO.
     * @returns {Promise<object>}
     */
    async upload(url, requestDto) {
        if (typeof requestDto.validate === 'function') {
            requestDto.validate();
        }

        // Strapi expected format: { data: { ... } }
        const body = { data: requestDto };

        return await fetchWrapper(url, true, 'application/json', 'POST', body);
    }
}
