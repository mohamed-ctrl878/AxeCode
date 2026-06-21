import { TaskDTO } from './TaskDTO';

export class WorkspaceItemDTO {
    constructor(data = {}) {
        this.id = data.id || data.documentId;
        this.documentId = data.documentId;
        this.projectId = data.project?.documentId || data.project;
        this.project_member = data.project_member?.documentId || data.project_member;
        this.type = data.type;
        this.title = data.title;
        this.content = data.content;
        this.status = data.status;
        this.linked_task = data.linked_task ? new TaskDTO(data.linked_task) : null;
    }
}
