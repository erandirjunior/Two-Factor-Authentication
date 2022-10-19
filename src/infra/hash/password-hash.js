const IPasswordHash = require('./../../domain/ipassword-hash');
const Bcrypt = require('bcrypt');
const { promisify } = require('util');
const compareAsync = promisify(Bcrypt.compare);

module.exports = class PasswordHash extends IPasswordHash {
    constructor() {
        super();
    }

    compare(password, hash) {
        return compareAsync(password, hash);
    }
}