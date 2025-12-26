import { ProblemChangesDTO } from "../../domain/reqs_dtos/ProblemUploadDTO";

export class problemDTO extends ProblemChangesDTO {
  constructor({
    id,
    documentId,
    dificulty,
    dislikes,
    seeproblem,
    acceptedproblem,
    likes,
    userputlike,
    createdAt,
    updatedAt,
    publishedAt,
    comments,
    testCases,
    functionName,
    functionReturnType,
    language,
    tittle,
    description,
    courses,
    problem_types,
  }) {
    super({
      dificulty,
      testCases,
      functionName,
      functionReturnType,
      language,
      tittle,
      description,
      courses,
      problem_types,
    });
    this.id = id;
    this.documentId = documentId;
    this.dislikes = dislikes;
    this.seeproblem = seeproblem;
    this.acceptedproblem = acceptedproblem;
    this.likes = likes;
    this.userputlike = userputlike;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.publishedAt = publishedAt;
    this.comments = comments;
  }
}
