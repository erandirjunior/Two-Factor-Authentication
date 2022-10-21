const InvalidArgumentError = require('./invalid-argument-error');
const throwError = require("./throw-error");

module.exports = class Token {
    constructor({token, emailToken}) {
        if (!token || !emailToken) {
            throwError(InvalidArgumentError, 'Fields token and emailToken cannot be empty!');
        }
        this.token = token;
        this.emailToken = emailToken;
    }
}