import { BaseRepository } from './BaseRepository';
import QueryBuilder from '../../core/API/QueryBuilder';

/**
 * UserRepository: Handles user-specific data operations.
 * Extends BaseRepository for standard API interactions.
 */
export class UserRepository extends BaseRepository {
    constructor() {
        super();
        this.endpoint = import.meta.env.VITE_API_USER || '/api/users';
    }

    /**
     * Checks if a field (email or username) is already taken.
     * @param {string} field - The field to check ('email' or 'username').
     * @param {string} value - The value to check.
     * @returns {Promise<boolean>} - True if available, false if taken.
     */
    async checkAvailability(field, value) {
        try {
            const params = QueryBuilder.buildFilterObject(field, value);

            const response = await this.get(this.endpoint, params);

            // Strapi /api/users returns an array. If empty, it's available.
            return Array.isArray(response) && response.length === 0;
        } catch (error) {
            console.error(`Check ${field} availability error:`, error);
            // In case of error, we might want to fail safe or rethrow. 
            // For now, let's rethrow to let the UI handle it.
            throw error;
        }
    }

    /**
     * Searches for a user by email.
     * @param {string} email - The email to search for.
     * @returns {Promise<object | null>} - The user object if found, else null.
     */
    async searchByEmail(email) {
        try {
            const params = QueryBuilder.buildFilterObject('email', email);
            const response = await this.get(this.endpoint, params);

            if (Array.isArray(response) && response.length > 0) {
                return response[0];
            }
            return null;
        } catch (error) {
            console.error('[UserRepository] Search failed:', error);
            throw error;
        }
    }

    /**
     * Searches for a user by username.
     * @param {string} username - The username to search for.
     * @returns {Promise<object | null>} - The user object if found, else null.
     */
    async searchByUsername(username) {
        try {
            // Strapi /api/users supports filtering by username
            const params = {
                'filters[username][$eq]': username,
            };
            const response = await this.get(this.endpoint, params);

            if (Array.isArray(response) && response.length > 0) {
                return response[0];
            }
            return null;
        } catch (error) {
            console.error('[UserRepository] Username search failed:', error);
            throw error;
        }
    }

    /**
     * Gets the currently authenticated user's profile with full population.
     * @returns {Promise<object>} - The populated user object.
     */
    async getMe() {
        try {
            // Strapi /api/users/me supports population of relationships
            return await this.get(`${this.endpoint}/me`);
        } catch (error) {
            console.error('[UserRepository] Failed to fetch current user profile:', error);
            throw error;
        }
    }

    /**
     * Updates user data.
     * Note: Strapi's /api/users/:id does not use the standard { data: { ... } } wrapper.
     * @param {string|number} userId - The ID of the user to update.
     * @param {object} data - The fields to update.
     * @returns {Promise<object>} - The updated and FULLY POPULATED user object.
     */
    async updateUser(userId, data) {
        try {
            // 1. Perform the update
            // Using wrap: false because the users endpoint expects direct fields
            await this.put(this.endpoint, userId, data, false);

            // 2. Re-fetch the full profile via /me to ensure we get relations (avatar, role)
            // This is necessary because /api/users/:id PUT doesn't populate relations reliably
            return await this.getMe();
        } catch (error) {
            console.error('[UserRepository] Update failed:', error);
            throw error;
        }
    }
}
