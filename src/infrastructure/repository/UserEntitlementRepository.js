import { BaseRepository } from './BaseRepository';
import qs from 'qs';
import { UserEntitlementDTO } from '../DTO/UserEntitlementDTO';

/**
 * UserEntitlementRepository: Handles actual user enrollments and ownership records.
 * Manages Strapi 'user-entitlement' content type.
 */
export class UserEntitlementRepository extends BaseRepository {
    constructor() {
        super();
        this.endpoint = '/api/user-entitlements';
    }

    /**
     * Fetches all user entitlements for a specific product ID.
     * @param {string} productId - The entitlement group ID (e.g., course.entitlementsId).
     * @returns {Promise<Array>}
     */
    async getByProductId(productId) {
        if (!productId) return [];
        
        try {
            const query = qs.stringify({
                filters: {
                    productId: {
                        $eq: productId
                    }
                },
                populate: {
                    users_permissions_user: true
                }
            }, { encodeValuesOnly: true });

            const response = await this.get(`${this.endpoint}?${query}`);
            const dataArray = response.data || response || [];
            if (!Array.isArray(dataArray)) return [];

            return dataArray.map(item => new UserEntitlementDTO(item));
        } catch (error) {
            console.error('[UserEntitlementRepository] Fetch failed:', error);
            throw error;
        }
    }

    /**
     * Fetches all entitlements for the currently authenticated user.
     * @returns {Promise<Array>}
     */
    async getMyEntitlements() {
        try {
            const response = await this.get(this.endpoint);
            const dataArray = response.data || response || [];
            if (!Array.isArray(dataArray)) return [];

            return dataArray.map(item => new UserEntitlementDTO(item));
        } catch (error) {
            console.error('[UserEntitlementRepository] Fetch my enrollments failed:', error);
            throw error;
        }
    }

    /**
     * Creates a new user enrollment record.
     * @param {object} data - Enrollment data.
     * @returns {Promise<object>}
     */
    async create(data) {
        try {
            const response = await this.post(this.endpoint, data);
            return response.data;
        } catch (error) {
            console.error('[UserEntitlementRepository] Create failed:', error);
            throw error;
        }
    }

    /**
     * Deletes/Revokes an enrollment.
     * @param {string|number} id - Record ID.
     * @returns {Promise<boolean>}
     */
    async delete(id) {
        try {
            await super.delete(`${this.endpoint}/${id}`);
            return true;
        } catch (error) {
            console.error('[UserEntitlementRepository] Delete failed:', error);
            throw error;
        }
    }
}
