import { BaseRequest } from './BaseRequest';

/**
 * Request DTO for Blog creation/update.
 */
export class BlogRequest extends BaseRequest {
    constructor(data = {}) {
        super();
        this.description = data.description; // {blocks}
        this.image = data.imageId; // {id}
        this.tags = data.tagIds || [];
        this.isDraft = data.isDraft ?? true;
    }

    toPayload() {
        return {
            data: {
                description: this.description,
                image: this.image,
                tags: this.tags,
                isDraft: !!this.isDraft
            }
        };
    }

    validate() {
        super.validate();
        if (!this.description) throw new Error("Blog description is required.");
    }
}
