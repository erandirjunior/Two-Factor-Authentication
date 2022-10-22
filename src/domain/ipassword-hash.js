export default class IPasswordHash {
    compare(password, hash) {
        throw Error('Must be implemented');
    }
}