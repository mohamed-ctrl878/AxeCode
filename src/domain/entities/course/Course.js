export class CourseWhithMedia {
  constructor({ title, id, documentId, updatedAt, description, picture }) {
    this.title = title;
    this.id = id;
    this.documentId = documentId;
    this.updatedAt = updatedAt;
    this.description = description;
    this.picture = picture;
  }
}

export class CourseInfo {
  constructor(title, id, documentId, updatedAt, description) {
    this.title = title;
    this.id = id;
    this.documentId = documentId;
    this.updatedAt = updatedAt;
    this.description = description;
  }
}
