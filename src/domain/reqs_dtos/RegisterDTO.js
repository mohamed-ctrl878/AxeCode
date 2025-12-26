export class RegisterDTO {
  constructor({
    email = "",
    username = "",
    lastname = "",
    firstname = "",
    password = "",
    birthday = "",
    phone = "",
  }) {
    this.firstname = firstname;
    this.lastname = lastname;
    this.birthday = birthday;
    this.username = username;
    this.password = password;
    this.phone = phone;
    this.email = email;
  }
}
