import { BaseContentDTO } from './BaseContentDTO';
import { UserDTO } from './UserDTO';

export class CommentDTO extends BaseContentDTO {
    constructor(data = {}) {
        super(data);
        this.parentId = data.parentId; // {string}
        this.docId = data.docId; // {string}
        this.contentType = data.content_types; // {string} - Enum: lesson, blog, etc.
        this.commentBody = data.comment; // {object | array} - Blocks
        
        /**
         * Relationships
         */
        this.author = data.users_permissions_user ? new UserDTO(data.users_permissions_user) : null; // {UserDTO | null}
    }
}