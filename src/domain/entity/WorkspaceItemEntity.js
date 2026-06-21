export class WorkspaceItemEntity {
    constructor(data = {}) {
        this.id = data.id;
        this.uid = data.uid;
        this.projectId = data.projectId;
        this.projectMemberId = data.projectMemberId;
        this.type = data.type; // document, flowchart
        this.title = data.title;
        this.content = data.content; // Array of blocks or { nodes, edges }
        this.status = data.status; // draft, submitted, merged, rejected
        this.linkedTaskId = data.linkedTaskId;
        this.linkedTask = data.linkedTask; // TaskEntity
    }
}
