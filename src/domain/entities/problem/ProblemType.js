export class ProblemType {
  constructor({ id, documentId, title, updatedAt, problems }) {
    this.id = id;
    this.documentId = documentId;
    this.title = title;
    this.updatedAt = updatedAt;
    this.problems = problems;
  }
}

export class ProblemTypeInfo {
    constructor(title) {
        this.title = title;
    }
}
