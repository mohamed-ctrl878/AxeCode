import { BaseContentDTO } from './BaseContentDTO';
import { MediaDTO, UserDTO } from './SharedDTOs';

export class BlogDTO extends BaseContentDTO {
    constructor(data = {}) {
        super(data);
        this.description = data.description; // {object | array} - Blocks
        this.image = data.image ? new MediaDTO(data.image) : null; // {MediaDTO | null}
        
        /**
         * Relationships
         */
        this.publisher = data.publisher ? new UserDTO(data.publisher) : null; // {UserDTO | null}
    }
}
