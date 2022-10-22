import InvalidArgumentError from './invalid-argument-error.js';
import throwError from './throw-error.js';

export default class LoginPayload {
    #email;
    #password;

    constructor(email, password) {
        if (!email || !password) {
            throwError(InvalidArgumentError, 'Fields email and password must be filled!');
        }

        this.#email = email;
        this.#password = password;
    }

    get email() {
        return this.#email;
    }

    get password() {
        return this.#password;
    }
}