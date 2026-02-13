import { BaseRepository } from './BaseRepository';
import { ArticleRequest } from '../DTO/Request/ArticleRequest';

/**
 * Repository for Article entities.
 */
export class ArticleRepository extends BaseRepository {
    constructor() {
        super();
        this.endpoint = import.meta.env.VITE_API_ARTICLE;
    }

    /**
     * Creates a new article.
     * @param {object} rawData 
     * @returns {Promise<object>}
     */
    async create(rawData) {
        const url = this.buildUrl(this.endpoint);
        const request = new ArticleRequest(rawData);
        return await this.upload(url, request);
    }
}
