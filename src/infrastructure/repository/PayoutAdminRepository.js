import { repositoryRegistry } from './RepositoryRegistry';
import { PayoutDTO } from '../DTO/WalletDTO';

export class PayoutAdminRepository {
    constructor(apiClient = repositoryRegistry.apiClient) {
        this.apiClient = apiClient;
    }

    /**
     * Gets all payouts with pagination and filtering (Admin only)
     * @param {string} statusFilter 'PENDING', 'PAID', 'REJECTED', or null
     * @param {number} page
     * @param {number} pageSize
     * @param {string} search
     * @returns {Promise<{items: PayoutDTO[], meta: Object}>}
     */
    async getAll(statusFilter, page = 1, pageSize = 10, search = '') {
        try {
            const queryParams = new URLSearchParams();
            queryParams.append('pagination[page]', page);
            queryParams.append('pagination[pageSize]', pageSize);
            queryParams.append('sort', 'createdAt:desc');
            
            // Populate wallet and owner
            queryParams.append('populate[wallet][populate]', 'owner');

            if (statusFilter) {
                queryParams.append('filters[status][$eq]', statusFilter.toUpperCase());
            }

            // Simple search on details or method if search exists
            if (search) {
                queryParams.append('filters[$or][0][details][$containsi]', search);
                queryParams.append('filters[$or][1][method][$containsi]', search);
            }

            const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
            const response = await this.apiClient.get(`/api/payouts${queryString}`);
            
            const rawData = response?.data || [];
            const meta = response?.meta || {};
            
            return {
                items: Array.isArray(rawData) ? rawData.map(p => new PayoutDTO(p)) : [],
                meta
            };
        } catch (error) {
            console.error('[PayoutAdminRepository] getAll failed:', error);
            throw error;
        }
    }

    /**
     * Updates payout status
     * @param {string} documentId Payout document ID
     * @param {string} status 'PAID' or 'REJECTED'
     * @param {string} adminNotes Optional notes for rejection
     * @returns {Promise<PayoutDTO>}
     */
    async updateStatus(documentId, status, adminNotes = '') {
        try {
            const payload = {
                status: status.toUpperCase()
            };
            if (adminNotes) {
                payload.admin_notes = adminNotes;
            }
            
            // BaseRepository.put wraps the payload in { data: ... } by default
            const response = await this.apiClient.put('/api/payouts', documentId, payload);
            return new PayoutDTO(response?.data);
        } catch (error) {
            console.error('[PayoutAdminRepository] updateStatus failed:', error);
            throw error;
        }
    }
}
