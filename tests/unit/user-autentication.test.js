import assert from 'assert';
import UserAuthentication from '../../src/domain/user-authentication.js';
import EmailMock from './mocks/email-mock.js';
import RepositoryMock from './mocks/repository-mock.js';
import HashMock from './mocks/hash-mock.js';
import TokenMock from './mocks/token-mock.js';
import LoginPayload from '../../src/domain/login-payload.js';
import DomainError from '../../src/domain/domain-error.js';
const payload = new LoginPayload('erandir@email.com', '1234567');
const userAuthentication = new UserAuthentication(
    RepositoryMock,
    EmailMock,
    HashMock,
    TokenMock
);
expect(result).rejects.toThrow('Invalid token object!');

describe('User Authentication', function () {
    it('Invalid object repository', function () {
        const expected = DomainError;
        const result = () => new UserAuthentication(
            {},
            EmailMock,
            HashMock,
            TokenMock
        );
        assert.throws(result, expected);
    });

    it('Invalid object email', function () {
        const expected = DomainError;
        const result = () => new UserAuthentication(
            RepositoryMock,
            {},
            HashMock,
            TokenMock
        );
        assert.throws(result, expected)
    });

    it('Invalid object hash', function () {
        const expected = DomainError;
        const result = () => new UserAuthentication(
            RepositoryMock,
            EmailMock,
            {},
            TokenMock
        );
        assert.throws(result, expected)
    });

    it('Invalid object token', function () {
        const expected = DomainError;
        const result = () => new UserAuthentication(
            RepositoryMock,
            EmailMock,
            HashMock,
            {}
        );

        assert.throws(result, expected)
    });

    it('Invalid object login payload', async () => {
        const expected = DomainError;
        const result = async () => await userAuthentication.authenticate({});

        assert.rejects(result, expected)
    });

    it('Error exception find user', async () => {
        RepositoryMock.throwException = true;
        const expected = Error;
        const result = async () => await userAuthentication.authenticate(payload);

        assert.rejects(result, expected)
    });

    it('Error find user empty', async () => {
        RepositoryMock.throwException = false;
        RepositoryMock.returnEmpty = true;
        const expected = Error;
        const result = async () => await userAuthentication.authenticate(payload);

        assert.rejects(result, expected)
    });

    it('Error user without id', async () => {
        RepositoryMock.returnEmpty = false;
        RepositoryMock.returnEmptyObject = true;
        const expected = Error;
        const result = async () => await userAuthentication.authenticate(payload);

        assert.rejects(result, expected)
    });

    it('Error update user', async () => {
        RepositoryMock.returnEmptyObject = false;
        RepositoryMock.throwExceptionUpdate = true;
        const expected = Error;
        const result = async () => await userAuthentication.authenticate(payload);

        assert.rejects(result, expected)
    });

    it('Error email exception', async () => {
        RepositoryMock.throwExceptionUpdate = false;
        EmailMock.throwException = true;
        const expected = Error;
        const result = async () => await userAuthentication.authenticate(payload);

        assert.rejects(result, expected)
    });

    it('Error user divergent password', async () => {
        EmailMock.throwException = false;
        HashMock.passwordsAreEquals = false;
        const expected = Error;
        const result = async () => await userAuthentication.authenticate(payload);

        assert.rejects(result, expected)
    });

    it('Get token', async () => {
        HashMock.passwordsAreEquals = true;
        const result = await userAuthentication.authenticate(payload);

        assert.equal(result, '13eb4cb6-35dd-4536-97e6-0ed0e4fb1fb3');
    });
});