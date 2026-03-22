/**
 * Request DTO for creating or updating a Week (Schedule Module).
 * Maps high-level Domain data into Strapi-compatible flat payload.
 * Note: BaseRepository.post() already wraps this in { data: requestDto },
 * so this DTO must stay flat (no nested `this.data`), just like CourseRequest.
 */
export class WeekRequest {
    /**
     * @param {object} data
     * @param {string} data.title
     * @param {string} data.courseId - The documentId or id of the parent course
     */
    constructor(data) {
        this.title = data.title;
        this.course = data.courseId;
    }
}
