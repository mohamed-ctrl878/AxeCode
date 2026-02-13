import { BaseRepository } from './BaseRepository';
import { BlogRequest } from '../DTO/Request/BlogRequest';

/**
 * Repository for Blog entities.
 */
export class BlogRepository extends BaseRepository {
    constructor() {
        super();
        this.endpoint = import.meta.env.VITE_API_BLOG;
    }

    /**
     * Creates a new blog post.
     * @param {object} rawData 
     * @returns {Promise<object>}
     */
    async create(rawData) {
        const url = this.buildUrl(this.endpoint);
        const request = new BlogRequest(rawData);
        return await this.upload(url, request);
    }
}
