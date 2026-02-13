import { BaseEntity } from './BaseEntity';

/**
 * ContentEntity class for entities that represent publishable content.
 * @extends BaseEntity
 */
export class ContentEntity extends BaseEntity {
    /**
     * @param {object} props
     * @param {number} props.engagementScore
     * @param {Array<object|string>} props.tags
     * @param {Date|null} props.publishedAt
     */
    constructor(props = {}) {
        super(props);
        this.engagementScore = props.engagementScore || 0;
        this.tags = props.tags || [];
        this.publishedAt = props.publishedAt;
    }

    /**
     * Utility to check if content is published.
     * @returns {boolean}
     */
    get isPublished() {
        return !!this.publishedAt;
    }

    /**
     * Formatted engagement score (e.g., 1.2k).
     * @returns {string}
     */
    get displayEngagement() {
        if (this.engagementScore >= 1000) {
            return (this.engagementScore / 1000).toFixed(1) + 'k';
        }
        return this.engagementScore.toString();
    }
}
