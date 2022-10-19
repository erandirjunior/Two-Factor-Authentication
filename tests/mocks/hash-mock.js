const IPasswordHash = require('../../src/domain/ipassword-hash.js');

class HashMock extends IPasswordHash {
    passwordsAreEquals = true;

    constructor() {
        super();
    }

    compare(password, hash) {
        return this.passwordsAreEquals;
    }
}

module.exports = new HashMock();