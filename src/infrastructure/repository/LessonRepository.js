import { BaseRepository } from './BaseRepository';
import { LessonRequest } from '../DTO/Request/LessonRequest';

/**
 * Repository for Lesson entities.
 */
export class LessonRepository extends BaseRepository {
    constructor() {
        super();
        this.endpoint = import.meta.env.VITE_API_LESSONS;
    }

    /**
     * Creates a new lesson.
     * @param {object} rawData 
     * @returns {Promise<object>}
     */
    async create(rawData) {
        const url = this.buildUrl(this.endpoint);
        const request = new LessonRequest(rawData);
        return await this.upload(url, request);
    }
}
