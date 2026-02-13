import { BaseContentDTO } from './BaseContentDTO';
import { UserDTO } from './UserDTO';
import { MediaDTO } from './SharedDTOs';

/**
 * DTO for Chat Conversation.
 */
export class ConversationDTO extends BaseContentDTO {
    constructor(data = {}) {
        super(data);
        this.title = data.title; // {string}
        this.description = data.discription; // {object} - Blocks (Note: backend typo 'discription')
        this.photo = data.photo ? new MediaDTO(data.photo) : null; // {MediaDTO | null}
        
        // Relationships
        this.creator = data.creator ? new UserDTO(data.creator) : null;
        
        this.members = new Map(); // {Map<string | number, UserDTO>}
        if (Array.isArray(data.members)) {
            data.members.forEach(m => this.members.set(m.id || m.documentId, new UserDTO(m)));
        }

        this.admins = new Map(); // {Map<string | number, UserDTO>}
        if (Array.isArray(data.admins)) {
            data.admins.forEach(a => this.admins.set(a.id || a.documentId, new UserDTO(a)));
        }

        this.mutedUsers = new Map(); // {Map<string | number, UserDTO>}
        if (Array.isArray(data.muted_users)) {
            data.muted_users.forEach(u => this.mutedUsers.set(u.id || u.documentId, new UserDTO(u)));
        }
    }
}
