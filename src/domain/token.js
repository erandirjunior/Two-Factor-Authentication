import InvalidArgumentError from './invalid-argument-error.js';
import throwError from './throw-error.js';

export default class Token {
    constructor({token, emailToken}) {
        if (!token || !emailToken) {
            throwError(InvalidArgumentError, 'Fields token and emailToken cannot be empty!');
        }
        this.token = token;
        this.emailToken = emailToken;
    }
}