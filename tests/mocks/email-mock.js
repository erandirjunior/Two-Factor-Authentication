const IEmail = require('../../src/domain/iemail');

module.exports = class EmailMock extends IEmail {
    throwException = false;

    send(user, token) {
        if (this.throwException) {
            throw Error();
        }
        return Promise.resolve('Sent!');
    }
}