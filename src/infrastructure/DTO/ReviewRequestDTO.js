import { ProjectMemberDTO } from './ProjectDTO';
import { TaskDTO } from './TaskDTO';
import { WorkspaceItemDTO } from './WorkspaceItemDTO';

export class ReviewRequestDTO {
    constructor(data = {}) {
        this.id = data.id || data.documentId;
        this.documentId = data.documentId;
        this.projectId = data.project?.documentId || data.project;
        this.task = data.task ? new TaskDTO(data.task) : null;
        this.workspace_item = data.workspace_item ? new WorkspaceItemDTO(data.workspace_item) : null;
        this.external_link = data.external_link;
        this.requester = data.requester ? new ProjectMemberDTO(data.requester) : null;
        this.reviewer = data.reviewer ? new ProjectMemberDTO(data.reviewer) : null;
        this.status = data.status; // pending, approved, changes_requested, rejected
        this.message = data.message;
        this.feedback = data.feedback;
        this.createdAt = data.createdAt;
        this.updatedAt = data.updatedAt;
    }
}
