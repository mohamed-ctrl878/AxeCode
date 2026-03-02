import { ContentEntity } from './ContentEntity';

/**
 * ArticleEntity class for formal articles.
 */
export class ArticleEntity extends ContentEntity {
    /**
     * @param {object} props
     * @param {object|array} props.content - Blocks format
     * @param {UserEntity|null} props.author
     * @param {string} props.title
     * @param {{ average: number, count: number }} props.rating - Overall rating stats
     * @param {number} props.myRating - Current user's rating (0 if not rated)
     */
    constructor(props = {}) {
        super(props);
        this.content = props.content;
        this.author = props.author;
        this.title = props.title;
        this.rating = props.rating || { average: 0, count: 0 };
        this.myRating = props.myRating || 0;
    }

    /**
     * Extracts a plain text summary from the content blocks.
     * @returns {string}
     */
    get summary() {
        if (!this.content) return '';
        if (Array.isArray(this.content)) {
            const firstTextBlock = this.content.find(b => b.type === 'paragraph');
            return firstTextBlock?.children?.[0]?.text?.substring(0, 150) + '...' || '';
        }
        return '';
    }
}
