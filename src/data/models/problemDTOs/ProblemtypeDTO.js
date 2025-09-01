export class problemtypeDTO {
  constructor({
    id,
    documentId,
    title,
    createdAt,
    updatedAt,
    publishedAt,
    problems,
  }) {
    this.id = id;
    this.documentId = documentId;
    this.title = title;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.publishedAt = publishedAt;
    this.problems = problems;
  }
}
