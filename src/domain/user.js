module.exports = class User {
    token;
    emailToken;

    #id;
    #email;
    #password;
    #expired;

    constructor({id, email, password, token, emailToken, expired}) {
        if (!email || !password) {
            throw Error('Fields email end password must be filled!');
        }

        this.#id = id;
        this.#email = email;
        this.#password = password;
        this.token = token;
        this.emailToken = emailToken;
        this.#expired = expired;
    }

    get id() {
        if (!this.#id) {
            throw Error('Field id must be filled!');
        }

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