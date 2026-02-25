/**
 * Base class for all content-related DTOs.
 */
export class BaseContentDTO {
    constructor(data = {}) {
        this.id = data.id; // {number | string}
        this.createdAt = data.createdAt ? new Date(data.createdAt) : null; // {Date | null}
        this.updatedAt = data.updatedAt ? new Date(data.updatedAt) : null; // {Date | null}
        this.publishedAt = data.publishedAt ? new Date(data.publishedAt) : null; // {Date | null}
        this.documentId = data.documentId; // {string}
        this.engagementScore = data.engagement_score || 0; // {number}
        this.tags = Array.isArray(data.tags)
            ? data.tags.map(tag => tag)
            : []; // {Array<string | object>}

        // Interaction Metadata from API Enrichment
        this.likesCount = typeof data.likesCount === 'number' ? data.likesCount : 0; // {number}
        this.commentsCount = typeof data.commentsCount === 'number' ? data.commentsCount : 0; // {number}
        this.isLiked = !!data.isLikedByMe; // {boolean}
    }
}
