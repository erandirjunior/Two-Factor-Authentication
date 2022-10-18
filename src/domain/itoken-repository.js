module.exports = class ITokenRepository {
    findByToken(token) {
        throw Error('Must be implemented');
    }

    updateExpiredFieldToTrue(id) {
        throw Error('Must be implemented');
    }
}