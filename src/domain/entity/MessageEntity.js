import { ContentEntity } from './ContentEntity';

/**
 * MessageEntity class for individual chat messages.
 */
export class MessageEntity extends ContentEntity {
    /**
     * @param {object} props
     * @param {string} props.conversationId
     * @param {UserEntity|null} props.sender
     * @param {object|array} props.text - Blocks format
     */
    constructor(props = {}) {
        super(props);
        this.conversationId = props.conversationId;
        this.sender = props.sender;
        this.text = props.text;
    }

    /**
     * Checks if the message was sent by a specific user.
     * @param {string|number} userId 
     * @returns {boolean}
     */
    isFromUser(userId) {
        return this.sender?.id === userId || this.sender?.uid === userId;
    }

    /**
     * Extracts a preview of the message text.
     * @returns {string}
     */
    get preview() {
        if (!this.text) return '';
        if (Array.isArray(this.text)) {
            const firstTextBlock = this.text.find(b => b.type === 'paragraph');
            return firstTextBlock?.children?.[0]?.text?.substring(0, 50) || '';
        }
        return '';
    }
}
