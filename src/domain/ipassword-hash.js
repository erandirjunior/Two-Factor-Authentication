module.exports = class IPasswordHash {
    encrypt(password) {
        throw Error('Must be implemented');
    }

    isEqual(password, hash) {
        throw Error('Must be implemented');
    }
}