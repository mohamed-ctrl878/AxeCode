import { BaseRepository } from './BaseRepository';

/**
 * AuthRepository: Handles identity-related operations.
 * Implements IApiClient via BaseRepository.
 */
export class AuthRepository extends BaseRepository {
    constructor() {
        super();
        this.registerEndpoint = import.meta.env.VITE_API_REGISTER || '/api/auth/local/register';
        this.loginEndpoint = import.meta.env.VITE_API_LOGIN || '/api/auth/login';
        this.logoutEndpoint = import.meta.env.VITE_API_LOGOUT || '/api/auth/logout';
        this.meEndpoint = '/api/users/me';
    }

    /**
     * Fetches current authenticated user profile.
     * @returns {Promise<object>} - User profile data.
     */
    async me() {
        const { fetchWrapper } = await import('../../core/API/fetchWrapper');

        // Populate essential relations for UserDTO
        const params = {
            populate: ['avatar', 'role']
            // Add more relations if needed: 'submissions', 'posts', etc.
        };

        const { default: qs } = await import('qs');
        const queryString = qs.stringify(params, { encodeValuesOnly: true });
        const url = `${this.baseUrl}${this.meEndpoint}${queryString ? `?${queryString}` : ''}`;

        return await fetchWrapper(url, true, 'application/json', 'GET');
    }

    /**
     * Executes user registration.
     * @param {RegisterRequest} request - The registration DTO.
     * @returns {Promise<object>} - JWT and user data.
     */
    async register(request) {
        if (typeof request.validate === 'function') {
            request.validate();
        }

        const url = this.baseUrl + (this.registerEndpoint.startsWith('/') ? this.registerEndpoint : `/${this.registerEndpoint}`);
        const body = request.toPayload();

        const { fetchWrapper } = await import('../../core/API/fetchWrapper');
        return await fetchWrapper(url, true, 'application/json', 'POST', body);
    }

    /**
     * Executes user login.
     * @param {LoginRequest} request - The login DTO.
     * @returns {Promise<object>} - JWT and user data.
     */
    async login(request) {
        if (typeof request.validate === 'function') {
            request.validate();
        }

        const url = this.baseUrl + (this.loginEndpoint.startsWith('/') ? this.loginEndpoint : `/${this.loginEndpoint}`);
        const body = request.toPayload();

        const { fetchWrapper } = await import('../../core/API/fetchWrapper');
        return await fetchWrapper(url, true, 'application/json', 'POST', body);
    }
}
