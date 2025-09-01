export class UserAuthDto {
    constructor({identifier,password}){
        this.identifier = identifier;
        this.password = password;
    }
}