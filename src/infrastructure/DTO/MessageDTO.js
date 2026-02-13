import { BaseContentDTO } from './BaseContentDTO';
import { UserDTO } from './UserDTO';

/**
 * DTO for Chat Message.
 */
export class MessageDTO extends BaseContentDTO {
    constructor(data = {}) {
        super(data);
        this.conversationId = data.conversation?.id || data.conversation?.documentId || data.conversation;
        this.user = data.users_permissions_user ? new UserDTO(data.users_permissions_user) : null;
        this.message = data.message; // {object} - Blocks
    }
}
