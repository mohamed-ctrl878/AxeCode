import { IApiClient } from '../../domain/interface/IApiClient';
import { fetchWrapper } from '../../core/API/fetchWrapper';

/**
 * BaseRepository implementing IApiClient technical interface.
 * Handles URL construction and fetchWrapper integration.
 */
export class BaseRepository extends IApiClient {
    constructor() {
        super();
        this.baseUrl = import.meta.env.VITE_API_BASE_URL;
    }

    /**
     * @private
     */
    #buildUrl(endpoint) {
        const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
        return `${this.baseUrl}${path}`;
    }

    async post(endpoint, requestDto) {
        if (requestDto && typeof requestDto.validate === 'function') {
            requestDto.validate();
        }
        const url = this.#buildUrl(endpoint);
        const body = { data: requestDto };
        return await fetchWrapper(url, true, 'application/json', 'POST', body);
    }

    async put(endpoint, id, requestDto) {
        if (requestDto && typeof requestDto.validate === 'function') {
            requestDto.validate();
        }
        const url = this.#buildUrl(`${endpoint}/${id}`);
        const body = { data: requestDto };
        return await fetchWrapper(url, true, 'application/json', 'PUT', body);
    }

    async upload(endpoint, formData) {
        const url = this.#buildUrl(endpoint);
        return await fetchWrapper(url, true, null, 'POST', formData);
    }

    async get(endpoint, params = {}) {
        const url = this.#buildUrl(endpoint);
        // QueryBuilder logic could be integrated here if needed
        return await fetchWrapper(url, true, 'application/json', 'GET');
    }
}
