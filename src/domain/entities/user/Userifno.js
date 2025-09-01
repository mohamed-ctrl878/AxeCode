export class userInfo {
  constructor({ username, email, id }) {
    this.id = id;
    this.username = username;
    this.email = email;
  }
}

export class userWithAvatar extends userInfo {
  constructor({ avatar, username, email, id }) {
    super(username, email, id);
    this.avatar = avatar;
  }
}


export class userForSubmition {
  constructor( submition ) {
    this.submition = submition;
  }
}
