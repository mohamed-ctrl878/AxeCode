import { BaseContentDTO } from './BaseContentDTO';
import { MediaDTO } from './SharedDTOs';
import { UserDTO } from './UserDTO';

export class PostDTO extends BaseContentDTO {
    constructor(data = {}) {
        super(data);
        this.caption = data.caption; // {object | array} - Blocks
        
        this.media = new Map(); // {Map<string | number, MediaDTO>}
        if (Array.isArray(data.media)) {
            data.media.forEach(m => this.media.set(m.id, new MediaDTO(m)));
        }

        /**
         * Relationships
         */
        this.author = data.users_permissions_user ? new UserDTO(data.users_permissions_user) : null; // {UserDTO | null}
        this.article = data.article; // {object | ArticleDTO}
    }
}
