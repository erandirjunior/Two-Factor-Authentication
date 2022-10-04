module.exports = class IRepository {
    findByEmail(email) {
        throw Error('Must be implemented');
    }

    updateToken(user, authToken, authTokenEmail) {
        throw Error('Must be implemented');
    }
}