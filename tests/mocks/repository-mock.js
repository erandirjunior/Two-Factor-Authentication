const IRepository = require('../../src/domain/irepository');
const UserRegistered = require('../../src/domain/user-registered');

module.exports = class RepositoryMock extends IRepository {
    throwException = false;
    throwExceptionUpdate = false;
    userWithoutId = false;
    constructor() {

        super();
    }

    findByEmail(email) {
        if (this.throwException) {
            throw Error();
        }

        let user = new UserRegistered({id: 1, email: 'erandir@email.com', password: '123456'});

        if (this.userWithoutId) {
            user = new UserRegistered({id: 1, email: 'erandir@email.com', password: '123456'});
        }

        return Promise.resolve(user);
    }

    updateToken(user, authToken, authTokenEmail) {
        if (this.throwExceptionUpdate) {
            throw Error();
        }
        return Promise.resolve(true);
    }
}