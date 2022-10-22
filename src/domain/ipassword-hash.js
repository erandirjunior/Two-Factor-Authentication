export default class IPasswordHash {
    compare(password, hash) {
        throw Error('Method must be implemented!');
    }
}