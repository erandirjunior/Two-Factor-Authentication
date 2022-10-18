module.exports = class IGenerateToken {
    getToken() {
        throw Error('Must be implemented');
    }

    getEmailToken() {
        throw Error('Must be implemented');
    }
}