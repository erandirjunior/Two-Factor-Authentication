const IPasswordHash = require('../../src/domain/ipassword-hash.js');

module.exports = class HashMock extends IPasswordHash {
    constructor() {
        super();
    }

    encrypt(password) {
        return 'Ajd$%*DndkjjdsjIQIei746';
    }

    isEqual(password, hash) {
        return true;
    }
}