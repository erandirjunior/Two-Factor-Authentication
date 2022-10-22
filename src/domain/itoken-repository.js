export default class ITokenRepository {
    findByToken(token) {
        throw Error('Method must be implemented!');
    }

    updateExpiredFieldToTrue(id) {
        throw Error('Method must be implemented!');
    }
}