import IEmail from '../../../src/domain/iemail.js';

class EmailMock extends IEmail {
    throwException = false;

    send(user) {
        if (this.throwException) {
            throw Error();
        }
        return Promise.resolve('Sent!');
    }
}

export default new EmailMock();