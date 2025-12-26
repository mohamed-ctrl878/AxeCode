export class WeekDTO {
  constructor(data) {
    this.id = data?.id;
    this.documentId = data?.documentId;
    this.createdAt = data?.createdAt;
    this.updatedAt = data?.updatedAt;
    this.publishedAt = data?.publishedAt;
    this.locale = data?.locale;
    this.title = data?.title;
    this.lessons = data?.lessons;
    this.course = data?.course;
    this.users_permissions_user = data?.users_permissions_user;
  }
}
