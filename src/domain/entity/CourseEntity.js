import { ContentEntity } from './ContentEntity';

/**
 * CourseEntity class representing a full course.
 */
export class CourseEntity extends ContentEntity {
    /**
     * @param {object} props
     * @param {string} props.title
     * @param {object|array} props.description - Blocks
     * @param {MediaEntity|null} props.thumbnail
     * @param {string} props.difficulty
     * @param {number|null} props.price
     * @param {number} props.studentCount
     * @param {boolean} props.hasAccess
     * @param {UserEntity|null} props.instructor
     * @param {Array<object>} props.weeks
     * @param {number} props.rating
     */
    constructor(props = {}) {
        super(props);
        this.title = props.title || null;
        this.description = props.description || null;
        this.thumbnail = props.thumbnail || null;
        this.difficulty = props.difficulty || null;
        this.contentType = props.contentType || 'course';
        this.price = props.price ?? null;
        this.studentCount = props.studentCount || 0;
        this.hasAccess = props.hasAccess || false;
        this.entitlementsId = props.entitlementsId || null;
        this.instructor = props.instructor || null;
        this.weeks = props.weeks || [];
        this.rating = props.rating || 0;
    }

    /**
     * Returns a human-readable price or 'Free'.
     * @returns {string}
     */
    get displayPrice() {
        if (this.price === null || this.price === 0) return 'Free';
        return `$${this.price}`;
    }

    /**
     * Total lessons count across all weeks.
     * @returns {number}
     */
    get totalLessons() {
        return this.weeks.reduce((acc, week) => acc + (week.lessons?.length || 0), 0);
    }
}


export class CardCourseEntity {
    constructor(props = {}) {
        this.uid = props.uid || null;
        this.title = props.title || null;
        this.thumbnail = props.thumbnail || null;
        this.difficulty = props.difficulty || null;
        this.contentType = props.contentType || 'course';
        this.price = props.price ?? null;
        this.studentCount = props.studentCount || 0;
        this.hasAccess = props.hasAccess || false;
        this.entitlementsId = props.entitlementsId || null;
        this.instructor = props.instructor || null;
        this.weeks = props.weeks || [];
        this.rating = props.rating || 0;
    }
}

/**
 * CoursePreviewEntity — full preview representation for course details page.
 * Pipeline: API → CourseDTO → EntityMapper.toCoursePreview → CoursePreviewEntity
 * @extends ContentEntity
 */
export class CoursePreviewEntity extends ContentEntity {
    /**
     * @param {object} props
     * @param {string} props.title
     * @param {object|array} props.description - Rich text blocks
     * @param {MediaEntity|null} props.thumbnail
     * @param {string} props.difficulty - Enum: Easy, Medium, Advanced
     * @param {string} props.contentType
     * @param {number|null} props.price
     * @param {number} props.studentCount
     * @param {boolean} props.hasAccess
     * @param {string|null} props.entitlementsId
     * @param {UserEntity|null} props.instructor
     * @param {Array<object>} props.weeks - Weeks with nested lessons
     * @param {number} props.rating
     */
    constructor(props = {}) {
        super(props);
        this.title = props.title || null;
        this.description = props.description || null;
        this.thumbnail = props.thumbnail || null;
        this.difficulty = props.difficulty || null;
        this.contentType = props.contentType || 'course';
        this.price = props.price ?? null;
        this.studentCount = props.studentCount || 0;
        this.hasAccess = props.hasAccess || false;
        this.entitlementsId = props.entitlementsId || null;
        this.instructor = props.instructor || null;
        this.weeks = props.weeks || [];
        this.rating = props.rating || 0;
    }

    /**
     * Returns a human-readable price or 'Free'.
     * @returns {string}
     */
    get displayPrice() {
        if (this.price === null || this.price === 0) return 'Free';
        return `$${this.price}`;
    }

    /**
     * Total lessons count across all weeks.
     * @returns {number}
     */
    get totalLessons() {
        return this.weeks.reduce((acc, week) => acc + (week.lessons?.length || 0), 0);
    }
}