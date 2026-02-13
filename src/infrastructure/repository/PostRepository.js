import { BaseRepository } from './BaseRepository';
import { PostRequest } from '../DTO/Request/PostRequest';

/**
 * Repository for Post entities.
 */
export class PostRepository extends BaseRepository {
    constructor() {
        super();
        this.endpoint = import.meta.env.VITE_API_POSTS;
    }

    /**
     * Creates a new post.
     * @param {object} rawData 
     * @returns {Promise<object>}
     */
    async create(rawData) {
        const url = this.buildUrl(this.endpoint);
        const request = new PostRequest(rawData);
        return await this.upload(url, request);
    }
}
