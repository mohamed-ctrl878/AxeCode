import { BaseContentDTO } from './BaseContentDTO';
import { MediaDTO } from './SharedDTOs';
import { UserDTO } from './UserDTO';
import { WeekDTO } from './WeekDTO';
import { InteractionDTO } from './InteractionDTO';
import { EntitlementDTO } from './EntitlementDTO';

export class CourseDTO extends BaseContentDTO {
    constructor(data = {}) {
        super(data);
        this.title = data.title || null; // {string | null}
        this.description = data.description || null; // {object | array | null} - Blocks
        this.picture = data.picture ? new MediaDTO(data.picture) : null; // {MediaDTO | null}
        this.difficulty = data.difficulty === 'Rasy' ? 'Easy' : (data.difficulty || null); // {string | null} - Enum: Easy, Medium, Advanced
        this.contentType = data.contentType || 'course'; // {string}

        // Course Specific Fields
        this.price = data.price ?? null; // {number | null}
        this.studentCount = data.student_count || 0; // {number}
        this.hasAccess = data.hasAccess || false; // {boolean}
        this.entitlementsId = data.entitlementsId || null; // {string | null}

        // Detailed Entitlement
        this.entitlement = data.entitlement ? new EntitlementDTO(data.entitlement) : null; // {EntitlementDTO | null}

        /**
         * Relationships
         */
        this.weeks = new Map(); // {Map<string | number, WeekDTO>}
        if (Array.isArray(data.weeks)) {
            data.weeks.forEach(week => {
                this.weeks.set(week.id, new WeekDTO(week));
            });
        }

        this.problem_types = new Map(); // {Map<string | number, object>}
        if (Array.isArray(data.problem_types)) {
            data.problem_types.forEach(pt => this.problem_types.set(pt.id, pt));
        }

        this.course_types = new Map(); // {Map<string | number, object>}
        if (Array.isArray(data.course_types)) {
            data.course_types.forEach(ct => this.course_types.set(ct.id, ct));
        }

        this.instructor = data.users_permissions_user ? new UserDTO(data.users_permissions_user) : null; // {UserDTO | null}

        // Interactions
        this.interactions = data.interactions ? new InteractionDTO(data.interactions) : null; // {InteractionDTO | null}
    }
}
