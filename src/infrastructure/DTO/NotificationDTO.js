import { UserDTO } from './UserDTO';

export class NotificationDTO {
    constructor(data = {}) {
        this.id = data.id;
        this.documentId = data.documentId;
        this.type = data.type; // 'like', 'rate', 'comment', 'report', 'content_reported'
        this.contentType = data.content_type; // 'course', 'event', 'article', 'blog'
        this.contentDocId = data.content_doc_id;
        this.messageAr = data.message_ar;
        this.messageEn = data.message_en;
        this.actionUrl = data.action_url;
        this.extra = data.extra || {};
        this.read = !!data.read;
        this.createdAt = data.createdAt ? new Date(data.createdAt) : null;
        
        // Nested Relations (if populated)
        this.actor = data.actor ? new UserDTO(data.actor) : null;
    }
}

export class NotificationPreferenceDTO {
    constructor(data = {}) {
        this.id = data.id;
        this.documentId = data.documentId;
        this.disabledTopics = Array.isArray(data.disabled_topics) ? data.disabled_topics : [];
    }
}
