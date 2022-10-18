module.exports = class IWebToken {
    generateWebToken(user) {
        throw Error('Must be implemented')
    }
}