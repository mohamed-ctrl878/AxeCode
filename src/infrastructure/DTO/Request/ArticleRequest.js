import { BaseRequest } from './BaseRequest';

/**
 * Request DTO for Article creation/update.
 */
export class ArticleRequest extends BaseRequest {
    constructor(data = {}) {
        super();
        this.title = data.title;
        this.contentBlocks = data.content; // Logic mapping: UI 'content' -> schema 'contentBlocks'
        this.tags = data.tagIds || [];
    }

    validate() {
        super.validate();
        if (!this.title) throw new Error("Article title is required.");
    }
}
