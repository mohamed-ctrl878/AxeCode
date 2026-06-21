import { UserDTO } from './UserDTO';
import { SprintDTO } from './TaskDTO';

export class ProjectDTO {
    constructor(data = {}) {
        this.id = data.id || data.documentId;
        this.documentId = data.documentId;
        this.title = data.title;
        this.description = data.description;
        this.methodology = data.methodology; // agile, waterfall, kanban
        this.status = data.status; // draft, active, paused, completed, archived
        this.visibility = data.visibility; // public, private
        this.github_repo_url = data.github_repo_url;
        this.github_repo_id = data.github_repo_id;
        this.engagement_score = data.engagement_score;
        this.createdAt = data.createdAt;
        this.updatedAt = data.updatedAt;

        // Relations
        this.publisher = data.publisher ? new UserDTO(data.publisher) : null;
        this.roles = Array.isArray(data.project_roles || data.roles) ? (data.project_roles || data.roles).map(r => new ProjectRoleDTO(r)) : [];
        this.members = Array.isArray(data.project_members || data.members) ? (data.project_members || data.members).map(m => new ProjectMemberDTO(m)) : [];
        this.sprints = Array.isArray(data.sprints) ? data.sprints.map(s => new SprintDTO(s)) : [];
        this.wiki_docs = data.wiki_docs;
        this.architecture_diagram = data.architecture_diagram;
    }
}

export class ProjectRoleDTO {
    constructor(data = {}) {
        this.id = data.id || data.documentId;
        this.documentId = data.documentId;
        this.custom_label = data.custom_label;
        this.permissions = data.permissions || {}; // { read, write, review, admin }
        this.is_open = data.is_open;
        this.required_level = data.required_level;
        this.slots = data.slots;
        this.job_title_tag = data.job_title_tag ? new JobTitleTagDTO(data.job_title_tag) : null;
    }
}

export class ProjectMemberDTO {
    constructor(data = {}) {
        this.id = data.id || data.documentId;
        this.documentId = data.documentId;
        this.user = data.users_permissions_user ? new UserDTO(data.users_permissions_user) : null;
        this.project_role = data.project_role ? new ProjectRoleDTO(data.project_role) : null;
        this.github_username = data.github_username;
        this.is_active = data.is_active;
        this.joined_at = data.joined_at;
    }
}

export class ProjectApplicationDTO {
    constructor(data = {}) {
        this.id = data.id || data.documentId;
        this.documentId = data.documentId;
        this.type = data.type; // apply, invite
        this.status = data.status; // pending, accepted, rejected
        this.message = data.message;
        this.createdAt = data.createdAt;
        
        // Relations
        this.user = data.user ? new UserDTO(data.user) : null;
        this.project = data.project ? new ProjectDTO(data.project) : null;
        this.project_role = data.project_role ? new ProjectRoleDTO(data.project_role) : null;
    }
}

export class JobTitleTagDTO {
    constructor(data = {}) {
        this.id = data.id || data.documentId;
        this.documentId = data.documentId;
        this.slug = data.slug;
        this.label_ar = data.label_ar;
        this.label_en = data.label_en;
        this.category = data.category;
    }
}
