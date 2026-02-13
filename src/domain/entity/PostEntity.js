import { ContentEntity } from './ContentEntity';

/**
 * PostEntity class for social posts.
 */
export class PostEntity extends ContentEntity {
    /**
     * @param {object} props
     * @param {object|array} props.caption - Blocks format
     * @param {Array<MediaEntity>} props.media
     * @param {UserEntity|null} props.author
     * @param {object|null} props.article
     */
    constructor(props = {}) {
        super(props);
        this.caption = props.caption;
        this.media = props.media || [];
        this.author = props.author;
        this.article = props.article;
    }

    /**
     * Brief summary of the caption text for preview.
     * @returns {string}
     */
    get excerpt() {
        if (!this.caption) return '';
        // Basic extraction if caption is blocks, simplified for now
        if (Array.isArray(this.caption)) {
            const firstTextBlock = this.caption.find(b => b.type === 'paragraph');
            return firstTextBlock?.children?.[0]?.text?.substring(0, 100) + '...' || '';
        }
        return '';
    }

    /**
     * Checks if the post has multiple media items.
     * @returns {boolean}
     */
    get isGallery() {
        return this.media.length > 1;
    }
}
