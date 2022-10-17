const IPasswordHash = require('../../src/domain/ipassword-hash.js');

class HashMock extends IPasswordHash {
    passwordsAreEquals = true;

    constructor() {
        super();
    }

    encrypt(password) {
        return 'Ajd$%*DndkjjdsjIQIei746';
    }

    isEqual(password, hash) {
        return this.passwordsAreEquals;
    }
}

module.exports = new HashMock();