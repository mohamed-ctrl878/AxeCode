import { MediaDTO } from './SharedDTOs';

/**
 * Comprehensive User DTO based on backend schema.
 */
export class UserDTO {
    constructor(data = {}) {
        this.id = data.id; // {number | string}
        this.documentId = data.documentId; // {string}
        this.username = data.username; // {string}
        this.email = data.email; // {string}
        this.firstname = data.firstname; // {string}
        this.lastname = data.lastname; // {string}
        this.phone = data.phone; // {string}
        this.birthday = data.birthday; // {string} - Date
        this.university = data.university; // {string}
        this.confirmed = !!data.confirmed; // {boolean}
        this.blocked = !!data.blocked; // {boolean}

        /**
         * Technical Data
         */
        this.interestMap = data.interest_map || {}; // {object} - JSON
        this.seenHistory = data.seen_history || []; // {array} - JSON
        this.lastDecayDate = data.last_decay_date ? new Date(data.last_decay_date) : null; // {Date | null}

        /**
         * Relationships
         */
        this.avatar = data.avatar ? new MediaDTO(data.avatar) : null; // {MediaDTO | null}
        this.role = data.role; // {object}

        // Collections (Mapped by ID for quick access)
        this.submissions = new Map();
        if (Array.isArray(data.submissions)) {
            data.submissions.forEach(s => this.submissions.set(s.id, s));
        }

        this.posts = new Map();
        if (Array.isArray(data.posts)) {
            data.posts.forEach(p => this.posts.set(p.id, p));
        }

        this.likes = new Map();
        if (Array.isArray(data.likes)) {
            data.likes.forEach(l => this.likes.set(l.id, l));
        }

        this.comments = new Map();
        if (Array.isArray(data.comments)) {
            data.comments.forEach(c => this.comments.set(c.id, c));
        }

        this.courses = new Map();
        if (Array.isArray(data.courses)) {
            data.courses.forEach(c => this.courses.set(c.id, c));
        }

        this.events = new Map();
        if (Array.isArray(data.events)) {
            data.events.forEach(e => this.events.set(e.id, e));
        }

        this.scanners = new Map();
        if (Array.isArray(data.scanners)) {
            data.scanners.forEach(s => this.scanners.set(s.id, s));
        }

        this.enroledContents = new Map();
        if (Array.isArray(data.enroled_contents)) {
            data.enroled_contents.forEach(ec => this.enroledContents.set(ec.id, ec));
        }
    }
}
