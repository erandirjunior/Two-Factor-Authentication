const InvalidArgumentError = require('./invalid-argument-error');
const throwError = require('./throw-error');

module.exports = class LoginPayload {
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