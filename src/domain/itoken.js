module.exports = class IToken {
    generateWebToken(user) {
        throw Error('Must be implemented')
    }
}