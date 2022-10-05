const User = require('./user');

module.exports = class UserRegistered extends User {
    #id;
    token
    emailToken
    expireDate

    constructor({id, email, password, token, emailToken, expireDate}) {
        super({email, password})
        this.#id = id;
        this.token = token;
        this.emailToken = emailToken;
        this.expireDate = expireDate;
    }

    get id() {
        return this.#id;
    }
}