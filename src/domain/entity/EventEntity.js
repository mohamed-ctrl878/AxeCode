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
}
