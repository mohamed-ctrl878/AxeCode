/**
 * Interface for Analytics Data Access
 * Defines the contract for fetching CMS analytics.
 */
export class IAnalyticsAccess {
    /**
     * @param {CMSAnalyticsRequestDTO} requestDto 
     * @returns {Promise<Object>} raw analytics data
     */
    async getFullAnalytics(requestDto) {
        throw new Error("Method getFullAnalytics() must be implemented.");
    }
}
