/**
 * Entity for algorithmic problem Test Case.
 */
export class TestCaseEntity {
    constructor({
        id,
        documentId,
        input,
        expectedOutput,
        isHidden,
        order,
        problemId
    }) {
        this.id = id;
        this.documentId = documentId;
        this.input = input; // JSON object
        this.expectedOutput = expectedOutput; // JSON object
        this.isHidden = isHidden;
        this.order = order;
        this.problemId = problemId;
    }
}
