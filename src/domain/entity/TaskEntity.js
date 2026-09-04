export class TaskEntity {
    constructor(data = {}) {
        this.id = data.id;
        this.uid = data.uid;
        this.title = data.title;
        this.description = data.description;
        this.status = data.status; // todo, in_progress, in_review, done, blocked
        this.priority = data.priority;
        this.branchPattern = data.branchPattern;
        this.githubPrId = data.githubPrId;
        this.ciStatus = data.ciStatus;
        this.lastCommitSha = data.lastCommitSha;  // latest commit SHA (short)
        this.prUrl = data.prUrl;                  // GitHub PR URL
        this.prTitle = data.prTitle;              // GitHub PR title
        this.order = data.order;
        this.createdAt = data.createdAt;
        this.updatedAt = data.updatedAt;

        this.assignee = data.assignee; // ProjectMemberEntity
        this.sprint = data.sprint; // SprintEntity
        this.projectId = data.projectId;

        this.taskType = data.taskType || 'general';
        this.layerId = data.layerId;
        this.stage = data.stage || 'planning';
        this.checkpointId = data.checkpointId; // documentId of parent checkpoint
        this.checkpoint = data.checkpoint; // parent CheckpointEntity
    }
}

export class SprintEntity {
    constructor(data = {}) {
        this.id = data.id;
        this.uid = data.uid;
        this.number = data.number;
        this.goal = data.goal;
        this.status = data.status; // planned, active, completed
        this.startDate = data.startDate;
        this.endDate = data.endDate;
        this.retrospectiveNotes = data.retrospectiveNotes;
        this.projectId = data.projectId;
    }
}

export class CheckpointEntity {
    constructor(data = {}) {
        this.id = data.id;
        this.uid = data.uid;
        this.name = data.name;
        this.stage = data.stage;
        this.createdAt = data.createdAt;
        this.updatedAt = data.updatedAt;
        this.sprint = data.sprint; // SprintEntity
        this.tasks = data.tasks || []; // TaskEntity[]
        this.projectId = data.projectId;
    }
}

