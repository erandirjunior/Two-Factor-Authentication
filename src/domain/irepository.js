export default class IRepository {
    findByEmail(email) {
        throw Error('Must be implemented');
    }

    update(user) {
        throw Error('Must be implemented');
    }
}