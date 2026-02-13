import { ContentEntity } from './ContentEntity';

/**
 * CommentEntity class for user comments on various content.
 */
export class CommentEntity extends ContentEntity {
    /**
     * @param {object} props
     * @param {string|null} props.parentId
     * @param {string} props.targetId
     * @param {string} props.targetType
     * @param {object|array} props.body - Blocks format
     * @param {UserEntity|null} props.author
     */
    constructor(props = {}) {
        super(props);
        this.parentId = props.parentId;
        this.targetId = props.targetId;
        this.targetType = props.targetType;
        this.body = props.body;
        this.author = props.author;
    }

    /**
     * Checks if this is a reply to another comment.
     * @returns {boolean}
     */
    get isReply() {
        return !!this.parentId;
    }
}
