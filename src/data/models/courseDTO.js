export class courseDTO {
  constructor(data) {
    this.id = data?.id;
    this.documentId = data?.documentId;
    this.description = data?.description;
    this.createdAt = data?.createdAt;
    this.updatedAt = data?.updatedAt;
    this.publishedAt = data?.publishedAt;
    this.locale = data?.locale;
    this.title = data?.title;
    this.difficulty = data?.difficulty;
    this.picture = data?.picture;
    this.course_types = data?.course_types;
    this.problem_types = data?.problem_types;
    this.users_permissions_user = data?.users_permissions_user;
    this.weeks = data?.weeks;
  }
}
