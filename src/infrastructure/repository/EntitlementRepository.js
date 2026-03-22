import { BaseRepository } from './BaseRepository';
import QueryBuilder from '../../core/API/QueryBuilder';
import qs from 'qs';

/**
 * EntitlementRepository: Handles access rules and pricing orchestration.
 * Manages Strapi Entitlement content type.
 */
export class EntitlementRepository extends BaseRepository {
    constructor() {
        super();
        this.endpoint = '/api/entitlements';
    }

    /**
     * Fetches all entitlements for a specific content item (e.g., Course).
     * @param {string} itemId - The documentId of the course/item.
     * @returns {Promise<Array>}
     */
    async getForItem(itemId) {
        try {
            const query = qs.stringify({
                filters: {
                    itemId: {
                        $eq: itemId
                    }
                },
                populate: {
                    users_permissions_user: true
                }
            }, { encodeValuesOnly: true });

            const response = await this.get(`${this.endpoint}?${query}`);
            return response.data || [];
        } catch (error) {
            console.error('[EntitlementRepository] Fetch failed:', error);
            throw error;
        }
    }

    /**
     * Creates a new entitlement (grants access).
     * @param {object} data - Entitlement data.
     * @returns {Promise<object>}
     */
    async create(data) {
        try {
            const response = await this.post(this.endpoint, data);
            return response.data;
        } catch (error) {
            console.error('[EntitlementRepository] Create failed:', error);
            throw error;
        }
    }

    /**
     * Revokes an entitlement.
     * @param {string|number} id - Entitlement ID or documentId.
     * @returns {Promise<boolean>}
     */
    async delete(id) {
        try {
            await super.delete(`${this.endpoint}/${id}`);
            return true;
        } catch (error) {
            console.error('[EntitlementRepository] Delete failed:', error);
            throw error;
        }
    }
}
