import { ContentEntity } from './ContentEntity';

/**
 * EventEntity class for webinars, physical events, and workshops.
 */
export class EventEntity extends ContentEntity {
    /**
     * @param {object} props
     * @param {string} props.title
     * @param {string} props.type
     * @param {Date|null} props.startDate
     * @param {Date|null} props.endDate
     * @param {string} props.location
     * @param {MediaEntity|null} props.cover
     * @param {number|null} props.price
     * @param {number} props.registeredCount
     */
    constructor(props = {}) {
        super(props);
        this.title = props.title;
        this.type = props.type;
        this.startDate = props.startDate;
        this.endDate = props.endDate;
        this.location = props.location;
        this.cover = props.cover;
        this.price = props.price;
        this.registeredCount = props.registeredCount || 0;
        this.hasAccess = props.hasAccess || false;

        // Detailed fields
        this.description = props.description; // rich text blocks
        this.duration = props.duration;
        this.entitlementsId = props.entitlementsId;
        this.entitlement = props.entitlement; // EntitlementEntity
        this.speakers = props.speakers || [];
        this.activities = props.activities || [];
        this.organizer = props.organizer;
        this.images = props.images || []; // all gallery images

        // Interactions
        this.likesCount = props.likesCount || 0;
        this.commentsCount = props.commentsCount || 0;
        this.isLiked = props.isLiked || false;
        this.rating = props.rating || { average: 0, count: 0 };
        this.myRating = props.myRating || 0;
    }

    /**
     * Checks if the event is currently happening.
     * @returns {boolean}
     */
    get isActive() {
        const now = new Date();
        return this.startDate <= now && (this.endDate ? this.endDate >= now : true);
    }

    /**
     * Formatted date range for UI.
     * @returns {string}
     */
    get displayDateRange() {
        if (!this.startDate) return 'TBA';
        const start = this.startDate.toLocaleDateString();
        if (!this.endDate) return start;
        return `${start} - ${this.endDate.toLocaleDateString()}`;
    }
}


export class CardEventEntity {
    constructor(props = {}) {
        this.uid = props.uid;
        this.title = props.title;
        this.type = props.type;
        this.startDate = props.startDate;
        this.endDate = props.endDate;
        this.location = props.location;
        this.cover = props.cover;
        this.price = props.price;
        this.registeredCount = props.registeredCount || 0;
        this.hasAccess = props.hasAccess || false;
        this.duration = props.duration;
    }

    /**
     * Checks if the event is currently happening.
     * @returns {boolean}
     */
    get isActive() {
        if (!this.startDate) return false;
        const now = new Date();
        const start = this.startDate instanceof Date ? this.startDate : new Date(this.startDate);
        const end = this.endDate ? (this.endDate instanceof Date ? this.endDate : new Date(this.endDate)) : null;
        return start <= now && (end ? end >= now : true);
    }

    /**
     * Formatted date range for UI display.
     * @returns {string}
     */
    get displayDateRange() {
        if (!this.startDate) return 'TBA';
        const fmt = (d) => {
            const date = d instanceof Date ? d : new Date(d);
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        };
        const start = fmt(this.startDate);
        if (!this.endDate) return start;
        return `${start} - ${fmt(this.endDate)}`;
    }
}
