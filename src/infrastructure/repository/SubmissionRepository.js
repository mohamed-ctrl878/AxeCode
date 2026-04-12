import { repositoryRegistry } from './RepositoryRegistry';
import { SubmissionRequest } from '../DTO/Request/SubmissionRequest';

/**
 * SubmissionRepository - Infrastructure layer for code submission operations.
 * Encapsulates all API communication for Run, Submit, and Result polling.
 * Depends on IApiClient via RepositoryRegistry (DIP).
 */
export class SubmissionRepository {
    constructor(apiClient = repositoryRegistry.apiClient) {
        this.apiClient = apiClient;
        this.endpoint = import.meta.env.VITE_API_SUBMISSIONS;
    }

    /**
     * Submit code for full judging (all test cases, persisted).
     * POST /submissions
     * @param {{ problemId: string, code: string, language: string }} data
     * @returns {Promise<{ data: object, message: string }>}
     */
    async submit(data) {
        const request = new SubmissionRequest(data);
        request.validate();
        return await this.apiClient.post(this.endpoint, request);
    }

    /**
     * Run code for quick testing (lightweight, may not persist).
     * POST /submissions/test
     * @param {{ problemId: string, code: string, language: string }} data
     * @returns {Promise<{ data: object, message: string }>}
     */
    async run(data) {
        const request = new SubmissionRequest(data);
        request.validate();
        return await this.apiClient.post(`${this.endpoint}/test`, request);
    }

    /**
     * Poll submission result by documentId.
     * GET /submissions/:id
     * @param {string} submissionId - documentId of the submission
     * @returns {Promise<{ data: object }>}
     */
    async getResult(submissionId) {
        return await this.apiClient.get(`${this.endpoint}/${submissionId}`);
    }

    /**
     * Get all submissions for the current user, optionally filtered by problem.
     * GET /submissions?filters[problem][documentId]=xxx&filters[user][id]=userId
     * @param {string} problemDocId
     * @returns {Promise<{ data: Array }>}
     */
    async getUserSubmissions(problemDocId) {
        return await this.apiClient.get(this.endpoint, {
            filters: { problem: { documentId: problemDocId } },
            sort: 'createdAt:desc',
            populate: '*'
        });
    }

    /**
     * Get submission stats for a user (total and passed counts).
     * Faster than fetching all data as it uses pagination hints.
     * @param {string} username 
     * @returns {Promise<{ total: number, passed: number }>}
     */
    async getProfileStats(username) {
        try {
            const [totalRes, passedRes] = await Promise.all([
                this.apiClient.get(this.endpoint, {
                    filters: {
                        user: { username: { $eq: username } }
                    },
                    pagination: { limit: 0 }, // 0 is enough for total count
                    populate: [] // Skip population for speed
                }),
                this.apiClient.get(this.endpoint, {
                    filters: {
                        user: { username: { $eq: username } },
                        verdict: { $eq: 'accepted' }
                    },
                    pagination: { limit: 0 },
                    populate: []
                })
            ]);

            const extractTotal = (res) => {
                // Handle different Strapi response formats
                if (res?.meta?.pagination?.total !== undefined) return res.meta.pagination.total;
                if (res?.total !== undefined) return res.total;
                return Array.isArray(res?.data) ? res.data.length : 0;
            };

            return {
                total: extractTotal(totalRes),
                passed: extractTotal(passedRes)
            };
        } catch (error) {
            console.error('[SubmissionRepository] Failed to fetch profile stats:', error);
            return { total: 0, passed: 0 };
        }
    }
}
