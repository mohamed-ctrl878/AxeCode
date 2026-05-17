import { BaseRepository } from './BaseRepository';

export class RoleRepository extends BaseRepository {
    constructor() {
        super();
        this.endpoint = '/api/users-permissions/roles';
    }

    async getAllRoles() {
        try {
            const response = await this.get(this.endpoint);
            // Strapi /api/users-permissions/roles usually returns { roles: [...] }
            return response?.roles || response?.data || response || [];
        } catch (error) {
            console.error('[RoleRepository] Get all roles failed:', error);
            throw error;
        }
    }
}
