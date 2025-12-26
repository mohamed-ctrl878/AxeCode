export class LessoneDTO {
  constructor(data) {
    this.id = data?.id;
    this.documentId = data?.documentId;
    this.description = data?.description;
    this.createdAt = data?.createdAt;
    this.updatedAt = data?.updatedAt;
    this.publishedAt = data?.publishedAt;
    this.locale = data?.locale;
    this.title = data?.title;
    this.public = data?.public;
    this.video = data?.video;
    this.week = data?.week;
    this.users_permissions_user = data?.users_permissions_user;
  }
}
