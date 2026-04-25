import { IAnalyticsAccess } from '../../domain/interface/IAnalyticsAccess';
import { repositoryRegistry } from './RepositoryRegistry';

/**
 * AnalyticsRepository implementing IAnalyticsAccess.
 * Responsible for fetching aggregated system metrics.
 */
export class AnalyticsRepository extends IAnalyticsAccess {
    constructor(apiClient = repositoryRegistry.apiClient) {
        super();
        this.apiClient = apiClient;
        this.endpoint = import.meta.env.VITE_CMS_ANALYTICS_ENDPOINT || "/api/cms-analytics";
    }

    /**
     * Concrete implementation of the IAnalyticsAccess contract
     * @param {CMSAnalyticsRequestDTO} requestDto
     */
    async getFullAnalytics(requestDto) {
        try {
            const query = requestDto.toQueryString();
            const response = await this.apiClient.get(`${this.endpoint}${query}`);
            return response?.data || {};
        } catch (error) {
            console.error('[AnalyticsRepository] Fetch error:', error);
            throw error;
        }
    }
}
