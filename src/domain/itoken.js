module.exports = class IToken {
    getToken() {
        throw Error('Must be implemented');
    }

    getEmailToken() {
        throw Error('Must be implemented');
    }
}