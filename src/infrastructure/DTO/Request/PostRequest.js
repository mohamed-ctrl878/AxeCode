import { BaseRequest } from './BaseRequest';

/**
 * Request DTO for Post creation/update.
 */
export class PostRequest extends BaseRequest {
    constructor(data = {}) {
        super();
        this.caption = data.caption; // {blocks}
        this.article = data.articleId; // {id}
        this.media = data.mediaIds || []; // {array of ids}
        this.tags = data.tagIds || [];
    }

    validate() {
        super.validate();
        // No strict required fields other than maybe caption or media in practice
    }
}
