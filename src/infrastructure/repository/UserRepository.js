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
}
