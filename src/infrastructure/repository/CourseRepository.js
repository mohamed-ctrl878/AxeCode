import { BaseRepository } from './BaseRepository';
import { CourseRequest } from '../DTO/Request/CourseRequest';

/**
 * Repository for Course entities.
 */
export class CourseRepository extends BaseRepository {
    constructor() {
        super();
        this.endpoint = import.meta.env.VITE_API_COURSES;
    }

    /**
     * Creates a new course.
     * @param {object} rawData 
     * @returns {Promise<object>}
     */
    async create(rawData) {
        const url = this.buildUrl(this.endpoint);
        const request = new CourseRequest(rawData);
        return await this.upload(url, request);
    }
}
