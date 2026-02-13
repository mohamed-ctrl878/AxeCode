import { BaseContentDTO } from './BaseContentDTO';
import { UserDTO } from './UserDTO';

export class RoadmapDTO extends BaseContentDTO {
    constructor(data = {}) {
        super(data);
        this.title = data.title; // {string}
        this.description = data.description; // {object | array} - Blocks
        this.flowData = data.flowData; // {object} - JSON for React Flow
        this.color = data.color || '#FFD700'; // {string}
        this.icon = data.icon || 'faMapSigns'; // {string}

        /**
         * Relationships
         */
        this.author = data.author ? new UserDTO(data.author) : null; // {UserDTO | null}
    }
}
