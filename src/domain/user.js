module.exports = class User {
    token;
    emailToken;

    #id;
    #email;
    #password;
    #expireDate;

    constructor({id, email, password, token, emailToken, expireDate}) {
        if (!email || !password) {
            throw Error('Fields email end password must be filled!');
        }

        this.#id = id;
        this.#email = email;
        this.#password = password;
        this.token = token;
        this.emailToken = emailToken;
        this.#expireDate = expireDate;
    }

    get id() {
        if (!this.#id) {
            throw Error('Field id must be filled!');
        }

        return parseInt(this.#id);
    }

    get expireDate() {
        return this.#expireDate;
    }

    get email() {
        return this.#email;
    }

    get password() {
        return this.#password;
    }
}