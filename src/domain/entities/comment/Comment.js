export class Comment {
  constructor({id, documentId, comment, updatedAt, users_permissions_user}) {
    this.id = id;
    this.documentId = documentId;
    this.comment = comment;
    this.updatedAt = updatedAt;
    this.users_permissions_user = users_permissions_user;

  }


}
