import { repositoryRegistry } from './RepositoryRegistry';

export class PaymentRepository {
    constructor(apiClient = repositoryRegistry.apiClient) {
        this.apiClient = apiClient;
    }

    /**
     * Initiates a checkout process for a specific item (Event or Course)
     * @param {string} itemId - The documentId or id of the item
     * @param {string} contentType - 'event' or 'course'
     * @returns {Promise<{payment_key: string, order_id: string, iframe_url: string}>}
     */
    async initiateCheckout(itemId, contentType = 'event') {
        try {
            // Using BaseRepository.post which handles path prefixing and wrapping
            const response = await this.apiClient.post('/api/payments/initiate', { 
                itemId, 
                contentType 
            }, true);
            
            return response.data;
        } catch (error) {
            console.error('PaymentRepository initiateCheckout failed', error);
            throw error;
        }
    }
}
