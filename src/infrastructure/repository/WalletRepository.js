import { repositoryRegistry } from './RepositoryRegistry';
import { WalletDTO } from '../DTO/WalletDTO';

export class WalletRepository {
    constructor(apiClient = repositoryRegistry.apiClient) {
        this.apiClient = apiClient;
    }

    /**
     * Gets the current user's wallet
     * @returns {Promise<WalletDTO>}
     */
    async getMyWallet() {
        try {
            const response = await this.apiClient.get('/api/wallet/me');
            const data = response?.data || response;
            return new WalletDTO(data);
        } catch (error) {
            console.error('[WalletRepository] getMyWallet failed:', error);
            throw error;
        }
    }

    /**
     * Gets the platform's commission wallet (Admin only)
     * @returns {Promise<WalletDTO>}
     */
    async getPlatformWallet() {
        try {
            const response = await this.apiClient.get('/api/wallet/platform');
            const data = response?.data || response;
            return new WalletDTO(data);
        } catch (error) {
            console.error('[WalletRepository] getPlatformWallet failed:', error);
            throw error;
        }
    }

    /**
     * Gets all wallets with pagination (Admin only)
     * @param {Object} params { page, pageSize, owner_type, is_active }
     * @returns {Promise<{data: WalletDTO[], meta: Object}>}
     */
    async getAllWallets(params = {}) {
        try {
            const queryParams = new URLSearchParams();
            if (params.page) queryParams.append('page', params.page);
            if (params.pageSize) queryParams.append('pageSize', params.pageSize);
            if (params.owner_type) queryParams.append('owner_type', params.owner_type);
            if (params.is_active !== undefined) queryParams.append('is_active', params.is_active);

            const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
            const response = await this.apiClient.get(`/api/wallets${queryString}`);
            
            const rawData = response?.data || [];
            const meta = response?.meta || {};
            
            return {
                data: Array.isArray(rawData) ? rawData.map(w => new WalletDTO(w)) : [],
                meta
            };
        } catch (error) {
            console.error('[WalletRepository] getAllWallets failed:', error);
            throw error;
        }
    }

    /**
     * Updates a publisher's commission rate (Admin only)
     * @param {number|string} id Wallet ID
     * @param {number} commissionRate Number between 0 and 1
     * @returns {Promise<Object>}
     */
    async updateCommissionRate(id, commissionRate) {
        try {
            // Using endpoint prefix without trailing slash, id, payload, and wrap=false
            const response = await this.apiClient.put('/api/wallets', `${id}/commission`, { commission_rate: commissionRate }, false);
            return response?.data || response;
        } catch (error) {
            console.error('[WalletRepository] updateCommissionRate failed:', error);
            throw error;
        }
    }

    /**
     * Requests a payout from the publisher's wallet
     * @param {Object} payload { amount, method, details }
     * @returns {Promise<Object>}
     */
    async requestPayout({ amount, method, details }) {
        try {
            // Send unwrapped payload to match custom backend controller
            const response = await this.apiClient.post('/api/payouts/request', { amount, method, details }, false);
            return response?.data || response;
        } catch (error) {
            console.error('[WalletRepository] requestPayout failed:', error);
            throw error;
        }
    }
}
