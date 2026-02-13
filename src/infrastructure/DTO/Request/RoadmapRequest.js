import { BaseRequest } from './BaseRequest';

/**
 * Request DTO for Roadmap creation/update.
 */
export class RoadmapRequest extends BaseRequest {
    constructor(data = {}) {
        super();
        this.title = data.title;
        this.description = data.description; // {blocks}
        this.flowData = data.flowData; // {json}
        this.color = data.color || '#FFD700';
        this.icon = data.icon || 'faMapSigns';
        this.tags = data.tagIds || [];
    }

    validate() {
        super.validate();
        if (!this.title) throw new Error("Roadmap title is required.");
    }
}
