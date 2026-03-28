/**
 * DTO for algorithmic problem Test Case.
 */
export class TestCaseDTO {
    constructor(data = {}) {
        this.id = data.id;
        this.documentId = data.documentId;

        // Strapi 4/5 structure handling
        const attr = data.attributes || data;

        this.input = attr.input; // JSON
        this.expectedOutput = attr.expectedOutput; // JSON
        this.isHidden = attr.isHidden !== undefined ? attr.isHidden : true;
        this.order = attr.order || 0;

        // Relation
        this.problemId = attr.problem?.documentId || attr.problem?.id;
    }
}
