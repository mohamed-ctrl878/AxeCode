import { BaseContentDTO } from './BaseContentDTO';
import { UserDTO } from './UserDTO';
import { MediaDTO } from './SharedDTOs';

/**
 * DTO for Moderation Reports.
 */
export class ReportDTO extends BaseContentDTO {
    constructor(data = {}) {
        super(data);
        this.description = data.description; // {object} - Blocks
        this.contentType = data.content_type; // {string}
        this.docId = data.docId; // {string}
        
        // Relationships
        this.reporter = data.reporter_user ? new UserDTO(data.reporter_user) : null;
        this.reportedUser = data.reported_user ? new UserDTO(data.reported_user) : null;
        
        this.screens = new Map(); // {Map<string | number, MediaDTO>}
        if (Array.isArray(data.screans)) { // Backend typo 'screans'
            data.screans.forEach(s => this.screens.set(s.id || s.documentId, new MediaDTO(s)));
        }

        this.reportTypes = data.report_types || []; // {Array}
    }
}
