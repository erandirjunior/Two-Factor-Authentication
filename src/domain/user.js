import DomainError from'./domain-error.js';
import throwError from './throw-error.js';

export default class User {
    token;
    emailToken;

    #id;
    #email;
    #password;
    #expired;

    constructor({id, email, password, token, emailToken, expired}) {
        if (!id || !email || !password) {
            throwError(DomainError, 'Invalid user data!')
        }

        this.#id = id;
        this.#email = email;
        this.#password = password;
        this.token = token;
        this.emailToken = emailToken;
        this.#expired = expired;
    }

    get id() {
        return parseInt(this.#id);
    }

    get expired() {
        return !!this.#expired;
    }

    get email() {
        return this.#email;
    }

    get password() {
        return this.#password;
    }
}