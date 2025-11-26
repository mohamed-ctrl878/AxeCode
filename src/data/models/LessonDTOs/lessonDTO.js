export class LessoneDTO {
  constructor({
    id,
    documentId,
    title,
    description,
    createdAt,
    updatedAt,
    publishedAt,
    problem_types,
    video,
    course_types,
    weeks,
  }) {
    this.id = id;
    this.documentId = documentId;
    this.title = title;
    this.description = description;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.publishedAt = publishedAt;
    this.problem_types = problem_types;
    this.course_types = course_types;
    this.weeks = weeks;
    this.video = video;
  }

}
