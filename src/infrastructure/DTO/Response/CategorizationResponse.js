/**
 * Maps the Strapi CourseType or ProblemType backend payload into a clean, 
 * presentation-ready object containing just the essential unified fields.
 */
export class CategorizationResponse {
    constructor({ id, documentId, title }) {
        this.id = id;
        this.documentId = documentId;
        this.title = title || 'Untitled Category';
    }

    /**
     * Maps an array of raw item data blocks from Strapi to DTO instances.
     * @param {Array} apiDataArray - Example: [{ id: 1, documentId: 'x', title: 'meko' }, ...]
     */
    static fromArray(apiDataArray) {
        if (!Array.isArray(apiDataArray)) return [];
        return apiDataArray.map(item => new CategorizationResponse({
            id: item.id,
            documentId: item.documentId,
            title: item.title || item.attributes?.title // fallback in case Strapi formats it differently later
        }));
    }
}
