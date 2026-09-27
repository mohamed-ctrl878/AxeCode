import { ProjectMemberDTO } from './ProjectDTO';

export class TaskDTO {
    constructor(data = {}) {
        this.id = data.id || data.documentId;
        this.documentId = data.documentId;
        this.title = data.title;
        this.description = data.description;
        this.status = data.status; // todo, in_progress, in_review, done, blocked
        this.priority = data.priority; // low, medium, high, critical
        this.branch_pattern = data.branch_pattern;
        this.github_pr_id = data.github_pr_id;
        this.ci_status = data.ci_status; // pending, success, failure, cancelled
        this.last_commit_sha = data.last_commit_sha;
        this.pr_url = data.pr_url;
        this.pr_title = data.pr_title;
        this.order = data.order;
        this.createdAt = data.createdAt;
        this.updatedAt = data.updatedAt;

        // Extra fields
        this.task_type = data.task_type;
        this.layer_id = data.layer_id;
        this.stage = data.stage;

        // Relations
        this.assignee = data.assignee ? new ProjectMemberDTO(data.assignee) : null;
        this.sprint = data.sprint ? new SprintDTO(data.sprint) : null;
        this.checkpoint = data.checkpoint || null; // checkpoint documentId or object
        // project is omitted to avoid circular dependency, usually we just need project.id
        this.projectId = data.project?.documentId || data.project; 
    }
}

export class SprintDTO {
    constructor(data = {}) {
        this.id = data.id || data.documentId;
        this.documentId = data.documentId;
        this.number = data.number;
        this.goal = data.goal;
        this.status = data.status; // planned, active, completed
        this.start_date = data.start_date;
        this.end_date = data.end_date;
        this.retrospective_notes = data.retrospective_notes;
        
        // Relation IDs
        this.projectId = data.project?.documentId || data.project;
    }
}
