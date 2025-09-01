export class LessonInfo {
  constructor({tittle, id, documentId, updatedAt, description}) {
    this.tittle = tittle;
    this.id = id;
    this.documentId = documentId;
    this.updatedAt = updatedAt;
    this.description = description;
  }
}

export class LessonWhithMedia extends LessonInfo {
  constructor(tittle, id, documentId, updatedAt, description, video) {
    super(tittle, id, documentId, updatedAt, description);
    this.video = video;
  }
}
