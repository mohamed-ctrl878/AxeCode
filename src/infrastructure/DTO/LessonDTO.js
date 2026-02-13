import { BaseContentDTO } from './BaseContentDTO';
import { MediaDTO } from './SharedDTOs';
import { UserDTO } from './UserDTO';

export class LessonDTO extends BaseContentDTO {
    constructor(data = {}) {
        super(data);
        this.title = data.title; // {string}
        this.typeOfLesson = data.type_of_lesson || 'video'; // {string} - Enum: video, article
        this.isCompleted = !!data.isCompleted; // {boolean}
        this.video = data.video ? new MediaDTO(data.video) : null; // {MediaDTO | null}
        this.description = data.description; // {object | array} - Blocks
        this.public = !!data.public; // {boolean}

        /**
         * Relationships
         */
        this.course_types = new Map(); // {Map<string | number, object>}
        if (Array.isArray(data.course_types)) {
            data.course_types.forEach(ct => this.course_types.set(ct.id, ct));
        }

        this.problem_types = new Map(); // {Map<string | number, object>}
        if (Array.isArray(data.problem_types)) {
            data.problem_types.forEach(pt => this.problem_types.set(pt.id, pt));
        }

        this.week = data.week; // {object | WeekDTO}
        this.instructor = data.users_permissions_user ? new UserDTO(data.users_permissions_user) : null; // {UserDTO | null}
    }
}
