export class ProjectEntity {
    constructor(data = {}) {
        this.id = data.id;
        this.uid = data.uid;
        this.title = data.title;
        this.description = data.description;
        this.methodology = data.methodology;
        this.status = data.status;
        this.visibility = data.visibility;
        this.githubRepoUrl = data.githubRepoUrl;
        this.githubRepoId = data.githubRepoId;
        this.engagementScore = data.engagementScore;
        this.createdAt = data.createdAt;
        this.updatedAt = data.updatedAt;

        this.publisher = data.publisher; // UserEntity
        this.roles = data.roles || []; // Array of ProjectRoleEntity
        this.members = data.members || []; // Array of ProjectMemberEntity
        this.sprints = data.sprints || []; // Array of SprintEntity
        this.wikiDocs = data.wikiDocs;
        this.architectureDiagram = data.architectureDiagram;
    }
}

export class ProjectRoleEntity {
    constructor(data = {}) {
        this.id = data.id;
        this.uid = data.uid;
        this.customLabel = data.customLabel;
        this.permissions = data.permissions || {};
        this.isOpen = data.isOpen;
        this.requiredLevel = data.requiredLevel;
        this.slots = data.slots;
        this.jobTitleTag = data.jobTitleTag; // JobTitleTagEntity
    }
}

export class ProjectMemberEntity {
    constructor(data = {}) {
        this.id = data.id;
        this.uid = data.uid;
        this.user = data.user; // UserEntity
        this.projectRole = data.projectRole; // ProjectRoleEntity
        this.githubUsername = data.githubUsername;
        this.isActive = data.isActive;
        this.joinedAt = data.joinedAt;
    }
}

export class ProjectApplicationEntity {
    constructor(data = {}) {
        this.id = data.id;
        this.uid = data.uid;
        this.type = data.type;
        this.status = data.status;
        this.message = data.message;
        this.createdAt = data.createdAt;
        this.user = data.user; // UserEntity
        this.project = data.project; // ProjectEntity
        this.projectRole = data.projectRole; // ProjectRoleEntity
    }
}

export class JobTitleTagEntity {
    constructor(data = {}) {
        this.id = data.id;
        this.uid = data.uid;
        this.slug = data.slug;
        this.labelAr = data.labelAr;
        this.labelEn = data.labelEn;
        this.category = data.category;
    }
}
