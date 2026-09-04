import { IProjectAccess } from '../../domain/interface/IProjectAccess';
import { repositoryRegistry } from './RepositoryRegistry';
import { ProjectDTO, ProjectRoleDTO, ProjectMemberDTO, ProjectApplicationDTO, JobTitleTagDTO } from '../DTO/ProjectDTO';

export class ProjectRepository extends IProjectAccess {
    constructor(apiClient = repositoryRegistry.apiClient) {
        super();
        this.apiClient = apiClient;
        this.projectsEndpoint = import.meta.env.VITE_API_PROJECTS || 'api/projects';
        this.jobTitleTagsEndpoint = import.meta.env.VITE_API_JOB_TITLE_TAGS || 'api/job-title-tags';
        this.userJobTitlesEndpoint = import.meta.env.VITE_API_USER_JOB_TITLES || 'api/users/me/job-titles';
        this.projectApplicationsEndpoint = import.meta.env.VITE_API_PROJECT_APPLICATIONS || 'api/project-applications';
        this.userApplicationsEndpoint = 'api/users/me/applications';
    }

    async getAll(params = {}) {
        const response = await this.apiClient.get(this.projectsEndpoint, params);
        const data = response?.data || response || [];
        return data.map(item => new ProjectDTO(item));
    }

    async getById(id, params = {}) {
        const response = await this.apiClient.get(`${this.projectsEndpoint}/${id}`, params);
        return new ProjectDTO(response?.data || response);
    }

    async create(data) {
        const response = await this.apiClient.post(this.projectsEndpoint, data);
        return new ProjectDTO(response?.data || response);
    }

    async update(id, data) {
        const response = await this.apiClient.put(this.projectsEndpoint, id, data);
        return new ProjectDTO(response?.data || response);
    }

    async delete(id) {
        return await this.apiClient.delete(`${this.projectsEndpoint}/${id}`);
    }

    // --- Roles ---
    async getRoles(projectId) {
        const response = await this.apiClient.get(`${this.projectsEndpoint}/${projectId}/roles`);
        const data = response?.data || response || [];
        return data.map(item => new ProjectRoleDTO(item));
    }

    async createRole(projectId, data) {
        const response = await this.apiClient.post(`${this.projectsEndpoint}/${projectId}/roles`, data);
        return new ProjectRoleDTO(response?.data || response);
    }

    async updateRole(projectId, roleId, data) {
        const response = await this.apiClient.patch(`${this.projectsEndpoint}/${projectId}/roles/${roleId}`, data);
        return new ProjectRoleDTO(response?.data || response);
    }

    // --- Members ---
    async getMembers(projectId) {
        const response = await this.apiClient.get(`${this.projectsEndpoint}/${projectId}/members`);
        const data = response?.data || response || [];
        return data.map(item => new ProjectMemberDTO(item));
    }

    async removeMember(projectId, memberId) {
        return await this.apiClient.delete(`${this.projectsEndpoint}/${projectId}/members/${memberId}`);
    }

    async assignMemberRole(projectId, memberId, roleId) {
        const response = await this.apiClient.patch(`${this.projectsEndpoint}/${projectId}/members/${memberId}/assign-role`, { role: roleId });
        return response?.data || response;
    }

    async updateMemberGithubUsername(projectId, memberId, githubUsername) {
        const response = await this.apiClient.patch(
            `${this.projectsEndpoint}/${projectId}/members/${memberId}/github-username`,
            { github_username: githubUsername }
        );
        return new ProjectMemberDTO(response?.data || response);
    }

    // --- GitHub Repo Linking ---
    async linkGithubRepo(projectId, { github_repo_url, github_repo_id, github_webhook_secret }) {
        const response = await this.apiClient.patch(
            `${this.projectsEndpoint}/${projectId}/github-repo`,
            { github_repo_url, github_repo_id, github_webhook_secret }
        );
        return response?.data || response;
    }

    // --- Applications ---
    async applyToRole(projectId, data) {
        const response = await this.apiClient.post(`${this.projectsEndpoint}/${projectId}/apply`, data);
        return new ProjectApplicationDTO(response?.data || response);
    }

    async inviteToRole(projectId, data) {
        const response = await this.apiClient.post(`${this.projectsEndpoint}/${projectId}/invite`, data);
        return new ProjectApplicationDTO(response?.data || response);
    }

    async respondToApplication(applicationId, status) {
        const response = await this.apiClient.patch(`${this.projectApplicationsEndpoint}/${applicationId}/respond`, { decision: status });
        return new ProjectApplicationDTO(response?.data || response);
    }

    async getProjectApplications(projectId) {
        const response = await this.apiClient.get(`${this.projectsEndpoint}/${projectId}/applications`);
        const data = response?.data || response || [];
        return data.map(item => new ProjectApplicationDTO(item));
    }

    async getMyApplications() {
        const response = await this.apiClient.get(this.userApplicationsEndpoint);
        const data = response?.data || response || [];
        return data.map(item => new ProjectApplicationDTO(item));
    }

    // --- Job Title Tags (Static taxonomy) ---
    async getJobTitleTags() {
        const response = await this.apiClient.get(this.jobTitleTagsEndpoint);
        const data = response?.data || response || [];
        return data.map(item => new JobTitleTagDTO(item));
    }

    async getMyJobTitles() {
        const response = await this.apiClient.get(this.userJobTitlesEndpoint);
        const data = response?.data || response || [];
        return data; // Returns the junction objects { id, experience_level, job_title_tag }
    }

    async addMyJobTitle(jobTitleTagId, experienceLevel) {
        const response = await this.apiClient.post(this.userJobTitlesEndpoint, { job_title_tag: jobTitleTagId, experience_level: experienceLevel });
        return response?.data || response;
    }

    async removeMyJobTitle(tagId) {
        return await this.apiClient.delete(`${this.userJobTitlesEndpoint}/${tagId}`);
    }
}
