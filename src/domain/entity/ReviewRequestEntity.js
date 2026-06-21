export class ReviewRequestEntity {
    constructor(data = {}) {
        this.id = data.id;
        this.uid = data.uid;
        this.projectId = data.projectId;
        this.taskId = data.taskId;
        this.task = data.task; // TaskEntity
        this.workspaceItemId = data.workspaceItemId;
        this.workspaceItem = data.workspaceItem; // WorkspaceItemEntity
        this.externalLink = data.externalLink;
        this.requesterId = data.requesterId;
        this.requester = data.requester; // ProjectMemberEntity
        this.reviewerId = data.reviewerId;
        this.reviewer = data.reviewer; // ProjectMemberEntity
        this.status = data.status; // pending, approved, changes_requested, rejected
        this.message = data.message;
        this.feedback = data.feedback;
        this.createdAt = data.createdAt;
        this.updatedAt = data.updatedAt;
    }
}
