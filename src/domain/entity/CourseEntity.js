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
     */
    constructor(props = {}) {
        super(props);
        this.title = props.title;
        this.description = props.description;
        this.thumbnail = props.thumbnail;
        this.difficulty = props.difficulty;
        this.price = props.price;
        this.studentCount = props.studentCount || 0;
        this.hasAccess = props.hasAccess || false;
        this.instructor = props.instructor;
        this.weeks = props.weeks || [];
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
        this.title = props.title;
        this.thumbnail = props.thumbnail;
        this.difficulty = props.difficulty;
        this.price = props.price;
        this.studentCount = props.studentCount || 0;
        this.hasAccess = props.hasAccess || false;
        this.instructor = props.instructor;
        this.weeks = props.weeks || [];
    }
}