import { ContentEntity } from './ContentEntity';

/**
 * ConversationEntity class for chat conversations.
 */
export class ConversationEntity extends ContentEntity {
    /**
     * @param {object} props
     * @param {string} props.title
     * @param {object|array} props.description - Blocks
     * @param {MediaEntity|null} props.photo
     * @param {UserEntity|null} props.creator
     * @param {Array<UserEntity>} props.members
     * @param {Array<UserEntity>} props.admins
     */
    constructor(props = {}) {
        super(props);
        this.title = props.title;
        this.description = props.description;
        this.photo = props.photo;
        this.creator = props.creator;
        this.members = props.members || [];
        this.admins = props.admins || [];
    }

    /**
     * Checks if a user is an admin of the conversation.
     * @param {string|number} userId 
     * @returns {boolean}
     */
    isAdmin(userId) {
        return this.admins.some(admin => admin.id === userId || admin.uid === userId);
    }

    /**
     * Returns the number of participants.
     * @returns {number}
     */
    get participantCount() {
        return this.members.length;
    }
}
