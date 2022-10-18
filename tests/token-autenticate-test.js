const assert = require('assert');
const TokenAuthentication = require('../src/domain/token-authentication');
const TokenRepositoryMock = require('./mocks/token-repository-mock');
const WebTokenMock = require('./mocks/web-token-mock');
const Token = require('./../src/domain/token');
const tokenAuthentication = new TokenAuthentication(TokenRepositoryMock, WebTokenMock);
const token = new Token({
    token: '13eb4cb6-35dd-4536-97e6-0ed0e4fb1fb3',
    emailToken: '4RV651gR93hDAGiTCYhmhh'
});

describe('Token Authentication', function () {
    it('Invalid object repository', function () {
        const expected = Error;
        const result = () => new TokenAuthentication(
            {},
            {}
        );
        assert.throws(result, expected)
    });

    it('Invalid object web token', function () {
        const expected = Error;
        const result = () => new TokenAuthentication(
            TokenRepositoryMock,
            {}
        );
        assert.throws(result, expected)
    });

    it('Invalid object token', function () {
        const expected = Error;
        const result = async () => await tokenAuthentication.authenticate({});
        assert.rejects(result, expected)
    });

    it('Invalid object token', function () {
        const expected = Error;
        const result = async () => await tokenAuthentication.authenticate(token);
        assert.rejects(result, expected)
    });

    it('Throw exception get user', function () {
        const expected = Error;
        TokenRepositoryMock.throwException = true;
        const result = async () => await tokenAuthentication.authenticate(token);
        assert.rejects(result, expected)
    });

    it('Throw exception token expired', function () {
        const expected = Error;
        TokenRepositoryMock.throwException = false;
        TokenRepositoryMock.throwExceptionTokenExpired = true;
        const result = async () => await tokenAuthentication.authenticate(token);
        assert.rejects(result, expected)
    });

    it('Throw exception update user', function () {
        const expected = Error;
        TokenRepositoryMock.throwExceptionTokenExpired = false;
        TokenRepositoryMock.throwExceptionUpdate = true;
        const result = async () => await tokenAuthentication.authenticate(token);
        assert.rejects(result, expected)
    });

    it('Throw exception generate web token', function () {
        const expected = Error;
        TokenRepositoryMock.throwExceptionUpdate = false;
        WebTokenMock.throwException = true
        const result = async () => await tokenAuthentication.authenticate(token);
        assert.rejects(result, expected)
    });

    it('Generate token', async () => {
        const expected = '763a5b89-9c96-4f9b-8daa-0b411c7c671e';
        WebTokenMock.throwException = false;
        const result = await tokenAuthentication.authenticate(token);
        assert.equal(result, expected)
    });
});