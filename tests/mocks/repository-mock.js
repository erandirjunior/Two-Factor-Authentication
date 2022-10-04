const IRepository = require('../../src/domain/irepository');
const UserRegistered = require('../../src/domain/user-registered');

module.exports = class RepositoryMock extends IRepository {
    constructor() {
        super();
    }

    findByEmail(email) {
        const user = new UserRegistered({id: 1, email: 'erandir@email.com', password: '123456'});
        return Promise.resolve(user);
    }

    updateToken(user, authToken, authTokenEmail) {
        return Promise.resolve(true);
    }
}