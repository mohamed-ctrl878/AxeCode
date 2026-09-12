import { ContentEntity } from './ContentEntity';

/**
 * LessonEntity class for educational lessons.
 */
export class LessonEntity extends ContentEntity {
    /**
     * @param {object} props
     * @param {string} props.title
     * @param {string} props.type - Enum: video, article
     * @param {boolean} props.isCompleted
     * @param {MediaEntity|null} props.video
     * @param {object|array} props.description - Blocks format
     * @param {boolean} props.isPublic
     * @param {UserEntity|null} props.instructor
     */
    constructor(props = {}) {
        super(props);
        this.title = props.title;
        this.type = props.type || 'video';
        this.isCompleted = props.isCompleted || false;
        this.video = props.video;
        this.description = props.description;
        this.isPublic = props.isPublic || false;
        this.instructor = props.instructor;

        // Embedded video support
        this.embedSource = props.embedSource || null;
        this.embedUrl = props.embedUrl || null;
        this.embedMetadata = props.embedMetadata || null;
    }

    /**
     * Checks if the lesson is an embedded external video.
     * @returns {boolean}
     */
    get isEmbedded() {
        return this.type === 'embedded';
    }

    /**
     * Checks if the lesson is a video lesson.
     * @returns {boolean}
     */
    get isVideo() {
        return this.type === 'video';
    }

    /**
     * Checks if the lesson is an article lesson.
     * @returns {boolean}
     */
    get isArticle() {
        return this.type === 'article';
    }

    /**
     * Returns the provider-specific embed URL for iframe rendering.
     * Falls back to raw embedUrl if metadata is missing.
     * @returns {string|null}
     */
    get embedPlayerUrl() {
        return this.embedMetadata?.embedUrl || this.embedUrl || null;
    }

    /**
     * Returns the cached thumbnail from the provider.
     * @returns {string|null}
     */
    get embedThumbnail() {
        return this.embedMetadata?.thumbnail || null;
    }
}
