export class IWorkspaceAccess {
    async getWorkspace(projectId) { throw new Error("Method not implemented."); }
    async createWorkspaceItem(projectId, data) { throw new Error("Method not implemented."); }
    async updateWorkspaceItem(projectId, itemId, data) { throw new Error("Method not implemented."); }
    async deleteWorkspaceItem(projectId, itemId) { throw new Error("Method not implemented."); }
}
