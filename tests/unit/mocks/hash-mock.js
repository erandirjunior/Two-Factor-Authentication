import IPasswordHash from '../../../src/domain/ipassword-hash.js';

class HashMock extends IPasswordHash {
    passwordsAreEquals = true;

    constructor() {
        super();
    }

    compare(password, hash) {
        return this.passwordsAreEquals;
    }
}

export default new HashMock();