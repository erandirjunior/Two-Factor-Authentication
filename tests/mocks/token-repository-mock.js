const ITokenRepository = require('../../src/domain/itoken-repository');
const User = require('../../src/domain/user');

class TokenRepositoryMock extends ITokenRepository {
    throwException = false;
    throwExceptionUpdate = false;
    throwExceptionTokenExpired = false;

    constructor() {
        super();
    }

    findByToken(token) {
        if (this.throwException) {
            throw Error();
        }

        if (this.throwExceptionTokenExpired) {
            throw Error();
        }

        let user = new User({id: 1, email: 'erandir@email.com', password: '123456'});

        return Promise.resolve(user);
    }

    updateExpiredFieldToTrue(id) {
        if (this.throwExceptionUpdate) {
            throw Error();
        }
        return Promise.resolve(true);
    }
}

module.exports = new TokenRepositoryMock();