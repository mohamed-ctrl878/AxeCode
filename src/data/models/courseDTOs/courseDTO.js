import { CourseUploadDTO } from "./CourseUploadDTO";

export class courseDTO extends CourseUploadDTO {
  constructor({
    id,
    documentId,
    createdAt,
    updatedAt,
    publishedAt,
    title,
    description,
    problem_types,
    weeks,
    course_types,
    picture,
  }) {
    super({
      title,
      description,
      problem_types,
      weeks,
      course_types,
      picture,
    });
    this.id = id;
    this.documentId = documentId;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.publishedAt = publishedAt;
  }


}

