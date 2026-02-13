import { BaseRequest } from './BaseRequest';

/**
 * Request DTO for Lesson creation/update.
 */
export class LessonRequest extends BaseRequest {
    constructor(data = {}) {
        super();
        this.title = data.title;
        this.type_of_lesson = data.type || 'video'; // Enum: video, article
        this.video = data.videoId; // {id}
        this.description = data.description; // {blocks}
        this.week = data.weekId; // {id}
        this.public = !!data.public;
        this.course_types = data.courseTypeIds || [];
        this.problem_types = data.problemTypeIds || [];
    }

    validate() {
        super.validate();
        if (!this.title) throw new Error("Lesson title is required.");
        if (!this.week) throw new Error("Lesson must be assigned to a week.");
    }
}
