import IToken from '../../../src/domain/itoken.js';

class WebTokenMock extends IToken {
    throwException = false;

    constructor() {
        super();
    }

    generateWebToken(user) {
        if (this.throwException) {
            throw Error();
        }

        return Promise.resolve('763a5b89-9c96-4f9b-8daa-0b411c7c671e');
    }
}

export default new WebTokenMock();