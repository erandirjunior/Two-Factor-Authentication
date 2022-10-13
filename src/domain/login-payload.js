module.exports = class LoginPayload {
    #email;
    #password;

    constructor(email, password) {
        if (!email || !password) {
            throw Error('Fields email end password must be filled!');
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