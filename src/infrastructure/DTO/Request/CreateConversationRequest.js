import { BaseRequest } from './BaseRequest';

/**
 * Request DTO for creating a new conversation.
 */
export class CreateConversationRequest extends BaseRequest {
    constructor(data = {}) {
        super();
        this.title = data.title;
        this.discription = data.description; // Preserve typo
        this.members = data.memberIds || [];
        this.admins = data.adminIds || [];
        this.photo = data.photoId;
    }

    validate() {
        super.validate();
        if (!this.title) throw new Error("Conversation title is required.");
        if (!this.members.length) throw new Error("Conversation must have at least one member.");
    }
}
