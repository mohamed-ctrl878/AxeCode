export class NotificationEntity {
    constructor(data = {}) {
        this.id = data.id;
        this.uid = data.uid; // Mapping from documentId
        this.type = data.type; 
        this.contentType = data.contentType;
        this.contentDocId = data.contentDocId;
        this.messageAr = data.messageAr;
        this.messageEn = data.messageEn;
        this.actionUrl = data.actionUrl;
        this.extra = data.extra;
        this.read = data.read;
        this.createdAt = data.createdAt;
        this.actor = data.actor;
    }
}
