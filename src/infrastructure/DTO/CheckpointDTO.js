import { TaskDTO, SprintDTO } from './TaskDTO';

export class CheckpointDTO {
    constructor(data = {}) {
        this.id = data.id || data.documentId;
        this.documentId = data.documentId;
        this.name = data.name;
        this.stage = data.stage;
        this.createdAt = data.createdAt;
        this.updatedAt = data.updatedAt;

        // Relations
        this.sprint = data.sprint ? new SprintDTO(data.sprint) : null;
        this.tasks = Array.isArray(data.tasks) ? data.tasks.map(t => new TaskDTO(t)) : [];
        this.projectId = data.project?.documentId || data.project;
    }
}
