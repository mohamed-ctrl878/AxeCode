import { ContentEntity } from './ContentEntity';

/**
 * BlogEntity class for long-form articles.
 */
export class BlogEntity extends ContentEntity {
    /**
     * @param {object} props
     * @param {object|array} props.description - Blocks
     * @param {MediaEntity|null} props.image
     * @param {UserEntity|null} props.author
     */
    constructor(props = {}) {
        super(props);
        this.description = props.description;
        this.image = props.image;
        this.author = props.author;
    }

    /**
     * Reading time estimation.
     * @returns {string}
     */
    get readingTime() {
        // Simple logic: count children in blocks
        const blockCount = Array.isArray(this.description) ? this.description.length : 1;
        const minutes = Math.max(1, Math.ceil(blockCount / 5));
        return `${minutes} min read`;
    }
}
