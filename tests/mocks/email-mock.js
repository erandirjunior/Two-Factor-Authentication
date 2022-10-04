const IEmail = require('../../src/domain/iemail');

module.exports = class EmailMock extends IEmail {
    send(user, token) {
        Promise.resolve('Sent!');
    }
}