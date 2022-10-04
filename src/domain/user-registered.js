const User = require('./user');

module.exports = class UserRegistered extends User {
    #id;

    constructor({id, email, password}) {
        super({email, password})
        this.#id = id;
    }

    get id() {
        return this.#id;
    }
}