import { BaseRequest } from './BaseRequest';

/**
 * Request DTO for sending a message.
 */
export class SendMessageRequest extends BaseRequest {
    constructor(conversationId, messageBlocks) {
        super();
        this.conversation = conversationId;
        this.message = messageBlocks;
    }

    validate() {
        super.validate();
        if (!this.conversation) throw new Error("Conversation ID is required.");
        if (!this.message) throw new Error("Message content is required.");
    }
}
