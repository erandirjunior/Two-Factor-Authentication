import ITokenRepository from '../../../src/domain/itoken-repository.js';
import User from '../../../src/domain/user.js';

class TokenRepositoryMock extends ITokenRepository {
    throwException = false;
    throwExceptionUpdate = false;
    throwExceptionTokenExpired = false;
    returnEmpty = false;

    constructor() {
        super();
    }

    findByToken(token) {
        if (this.returnEmpty) {
            return  '';
        }

        if (this.throwException) {
            throw Error();
        }

        const obj = {id: 1, email: 'erandir@email.com', password: '123456', expired: true};

        if (this.throwExceptionTokenExpired) {
            delete obj.expired;
        }

        let user = new User(obj);

        return Promise.resolve(user);
    }

    updateExpiredFieldToTrue(id) {
        if (this.throwExceptionUpdate) {
            throw Error();
        }
        return Promise.resolve(true);
    }
}

export default new TokenRepositoryMock();