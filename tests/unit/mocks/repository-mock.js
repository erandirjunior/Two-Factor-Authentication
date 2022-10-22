import IRepository from '../../../src/domain/irepository.js';
import User from '../../../src/domain/user.js';

class RepositoryMock extends IRepository {
    throwException = false;
    throwExceptionUpdate = false;
    returnEmptyObject = false;
    returnEmpty = false;

    constructor() {
        super();
    }

    findByEmail(email) {
        if (this.throwException) {
            throw Error();
        }

        if (this.returnEmpty) {
            return '';
        }

        if (this.returnEmptyObject) {
            return {};
        }

        const user = new User({id: 1, email: 'erandir@email.com', password: '123456'});

        return Promise.resolve(user);
    }

    update(user) {
        if (this.throwExceptionUpdate) {
            throw Error();
        }
        return Promise.resolve(true);
    }
}

export default new RepositoryMock();