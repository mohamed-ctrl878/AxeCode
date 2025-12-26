export class commentDTO {
  constructor({
    id,
    documentId,
    comment,
    problemId,
    parentId,
    createdAt,
    updatedAt,
    publishedAt,
    problem,
    users_permissions_user,
  }) {
    this.id = id;
    this.documentId = documentId;
    this.comment = comment;
    this.problemId = problemId;
    this.parentId = parentId;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.publishedAt = publishedAt;
    this.problem = problem;
    this.users_permissions_user = users_permissions_user;
  }
}
