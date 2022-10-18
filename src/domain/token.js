module.exports = class Token {
    constructor({token, emailToken}) {
        if (!token || !emailToken) {
            throw Error('Fields token and emailToken cannot be empty!');
        }
        this.token = token;
        this.emailToken = emailToken;
    }
}