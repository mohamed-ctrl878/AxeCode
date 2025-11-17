export class UserDTO {
  constructor({
    username = null,
    email = null,
    provider = null,
    confirmed = null,
    blocked =null,
    role = null,
    avatar = null,
    comments = null,
    submition = null,
    id = null,
    documentId = null,
    createdAt = null,
    publishedAt = null,
    updatedAt = null,
  }) {
    this.id = id;
    this.documentId = documentId;
    this.username = username;
    this.email = email;
    this.provider = provider;
    this.avatar = avatar;
    this.comments = comments;
    this.createdAt = createdAt;
    this.publishedAt = publishedAt;
    this.confirmed = confirmed;
    this.blocked = blocked;
    this.role = role;
    this.submition = submition;
    this.updatedAt = updatedAt;
  }
}



// id
// documentId
// createdAt
// updatedAt
// publishedAt
// username
// email
// provider
// confirmed
// blocked
// submition
// role
// avatar
// comments
