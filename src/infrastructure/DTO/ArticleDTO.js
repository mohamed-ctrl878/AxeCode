import { BaseContentDTO } from './BaseContentDTO';
import { UserDTO } from './UserDTO';

export class ArticleDTO extends BaseContentDTO {
    constructor(data = {}) {
        super(data);
        this.title = data.title; // {string}
        this.contentBlocks = data.contentBlocks; // {object | array} - JSON content

        /**
         * Interaction metadata from backend enrichment.
         * Shape: { rating: { average, count }, myRating, commentsCount }
         */
        this.interactions = data.interactions || null;

        /**
         * Relationships
        */
        if (data?.ratingSummary) {
            this.interactions = {
                rating: {
                    average: data.ratingSummary?.average,
                    count: data.ratingSummary?.count
                },
            };
        }
        this.author = data.author ? new UserDTO(data.author) : null; // {UserDTO | null}

        this.posts = new Map(); // {Map<string | number, object>}
        if (Array.isArray(data.posts)) {
            data.posts.forEach(post => this.posts.set(post.id, post));
        }
    }
}
