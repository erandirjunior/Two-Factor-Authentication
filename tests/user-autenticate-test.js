const assert = require('assert');
const UserAuthentication = require('../src/domain/user-authentication');
const EmailMock = require('./mocks/email-mock');
const RepositoryMock = require('./mocks/repository-mock');
const HashMock = require('./mocks/hash-mock');
const TokenMock = require('./mocks/token-mock');
const LoginPayload = require('../src/domain/login-payload');
const payload = new LoginPayload('erandir@email.com', '1234567');
const userAuthentication = new UserAuthentication(
    RepositoryMock,
    EmailMock,
    HashMock,
    TokenMock
);

describe('User Authentication', function () {
    it('Invalid object repository', function () {
        const expected = Error;
        const result = () => new UserAuthentication(
            {},
            EmailMock,
            HashMock,
            TokenMock
        );
        assert.throws(result, expected)
    });

    it('Invalid object email', function () {
        const expected = Error;
        const result = () => new UserAuthentication(
            RepositoryMock,
            {},
            HashMock,
            TokenMock
        );
        assert.throws(result, expected)
    });

    it('Invalid object hash', function () {
        const expected = Error;
        const result = () => new UserAuthentication(
            RepositoryMock,
            EmailMock,
            {},
            TokenMock
        );
        assert.throws(result, expected)
    });

    it('Invalid object token', function () {
        const expected = Error;
        const result = () => new UserAuthentication(
            RepositoryMock,
            EmailMock,
            HashMock,
            {}
        );

        assert.throws(result, expected)
    });

    it('Invalid object login payload', async () => {
        const expected = Error;
        const result = async () => await userAuthentication.authenticate({});

        assert.rejects(result, expected)
    });

    it('Error find user', async () => {
        RepositoryMock.throwException = true;
        const expected = Error;
        const result = async () => await userAuthentication.authenticate(payload);

        assert.rejects(result, expected)
    });

    it('Error update user', async () => {
        RepositoryMock.throwExceptionUpdate = true;
        const expected = Error;
        const result = async () => await userAuthentication.authenticate(payload);

        assert.rejects(result, expected)
    });

    it('Error email exception', async () => {
        EmailMock.throwException = true;
        const expected = Error;
        const result = async () => await userAuthentication.authenticate(payload);

        assert.rejects(result, expected)
    });

    it('Error user without id', async () => {
        RepositoryMock.userWithoutId = true;
        const expected = Error;
        const result = async () => await userAuthentication.authenticate(payload);

        assert.rejects(result, expected)
    });

    it('Error user divergent password', async () => {
        HashMock.passwordsAreEquals = false;
        const expected = Error;
        const result = async () => await userAuthentication.authenticate(payload);

        assert.rejects(result, expected)
    });

    it('Get token', async () => {
        RepositoryMock.throwExceptionUpdate = false;
        RepositoryMock.throwException = false;
        RepositoryMock.userWithoutId = false;
        HashMock.passwordsAreEquals = true;
        EmailMock.throwException = false;
        const result = await userAuthentication.authenticate(payload);

        assert.equal(result, '13eb4cb6-35dd-4536-97e6-0ed0e4fb1fb3');
    });
});