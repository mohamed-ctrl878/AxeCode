import { BaseContentDTO } from './BaseContentDTO';
import { LessonDTO } from './LessonDTO';

export class WeekDTO extends BaseContentDTO {
    constructor(data = {}) {
        super(data);
        this.title = data.title; // {string}
        
        /**
         * Relationships
         */
        this.lessons = new Map(); // {Map<string | number, LessonDTO>}
        if (Array.isArray(data.lessons)) {
            data.lessons.forEach(lesson => {
                this.lessons.set(lesson.id, new LessonDTO(lesson));
            });
        }
        
        this.course = data.course; // {object | CourseDTO}
    }
}
