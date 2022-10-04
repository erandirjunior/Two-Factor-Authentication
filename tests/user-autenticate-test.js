const assert = require('assert');
const UserAuthentication = require('../src/domain/user-authentication');
const EmailMock = require('./mocks/email-mock');
const RepositoryMock = require('./mocks/repository-mock');
const HashMock = require('./mocks/hash-mock');
const TokenMock = require('./mocks/token-mock');
const User = require('../src/domain/user');

describe('User Authentication', function () {
    it('Invalid object repository', function () {
        const expected = Error;
        const result = () => new UserAuthentication(
            {},
            new EmailMock(),
            new HashMock(),
            new TokenMock()
        );
        assert.throws(result, expected)
    });

    it('Invalid object email', function () {
        const expected = Error;
        const result = () => new UserAuthentication(
            new RepositoryMock(),
            {},
            new HashMock(),
            new TokenMock()
        );
        assert.throws(result, expected)
    });

    it('Invalid object hash', function () {
        const expected = Error;
        const result = () => new UserAuthentication(
            new RepositoryMock(),
            new EmailMock(),
            {},
            new TokenMock()
        );
        assert.throws(result, expected)
    });

    it('Invalid object token', function () {
        const expected = Error;
        const result = () => new UserAuthentication(
            new RepositoryMock(),
            new EmailMock(),
            new HashMock(),
            {}
        );

        assert.throws(result, expected)
    });

    it('Invalid object use token', async () => {
        const expected = Error;
        const userAuthentication = new UserAuthentication(
            new RepositoryMock(),
            new EmailMock(),
            new HashMock(),
            new TokenMock()
        );
        const result = async () => await userAuthentication.authenticate({});
        assert.rejects(result, expected)
    });

    it('Error find user', async () => {
        const expected = Error;
        const repository = new RepositoryMock();
        repository.throwException = true;
        const userAuthentication = new UserAuthentication(
            repository,
            new EmailMock(),
            new HashMock(),
            new TokenMock()
        );

        const result = async () => await userAuthentication.authenticate(new User({
            email: 'erandir@email.com',
            password: '1234567'
        }));

        assert.rejects(result, expected)
    });

    it('Error user update', async () => {
        const expected = Error;
        const repository = new RepositoryMock();
        repository.throwExceptionUpdate = true;

        const userAuthentication = new UserAuthentication(
            repository,
            new EmailMock(),
            new HashMock(),
            new TokenMock()
        );

        const result = async () => await userAuthentication.authenticate(new User({
            email: 'erandir@email.com',
            password: '1234567'
        }));

        assert.rejects(result, expected)
    });

    it('Error email exception', async () => {
        const expected = Error;
        const email = new EmailMock();
        email.throwException = true;

        const userAuthentication = new UserAuthentication(
            new RepositoryMock(),
            email,
            new HashMock(),
            new TokenMock()
        );

        const result = async () => await userAuthentication.authenticate(new User({
            email: 'erandir@email.com',
            password: '1234567'
        }));

        assert.rejects(result, expected)
    });

    it('Error user without id', async () => {
        const expected = Error;
        const repository = new RepositoryMock();
        repository.userWithoutId = true;

        const userAuthentication = new UserAuthentication(
            repository,
            new EmailMock(),
            new HashMock(),
            new TokenMock()
        );

        const result = async () => await userAuthentication.authenticate(new User({
            email: 'erandir@email.com',
            password: '1234567'
        }));

        assert.rejects(result, expected)
    });

    it('Error user divergent password', async () => {
        const expected = Error;
        const hash = new HashMock();
        hash.passwordsAreEquals = false;

        const userAuthentication = new UserAuthentication(
            new RepositoryMock(),
            new EmailMock(),
            hash,
            new TokenMock()
        );

        const result = async () => await userAuthentication.authenticate(new User({
            email: 'erandir@email.com',
            password: '1234567'
        }));

        assert.rejects(result, expected)
    });

    it('Get token', async () => {
        const userAuthentication = new UserAuthentication(
            new RepositoryMock(),
            new EmailMock(),
            new HashMock(),
            new TokenMock()
        );
        const result = await userAuthentication.authenticate(new User({
            email: 'erandir@email.com',
            password: '1234567'
        }));

        assert.equal(result, '13eb4cb6-35dd-4536-97e6-0ed0e4fb1fb3');
    });
});