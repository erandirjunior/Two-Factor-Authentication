import assert from 'assert';
import TokenAuthentication from '../../src/domain/token-authentication.js';
import TokenRepositoryMock from './mocks/token-repository-mock.js';
import WebTokenMock from './mocks/web-token-mock.js';
import Token from '../../src/domain/token.js';
const tokenAuthentication = new TokenAuthentication(TokenRepositoryMock, WebTokenMock);
const token = new Token({
    token: '13eb4cb6-35dd-4536-97e6-0ed0e4fb1fb3',
    emailToken: '4RV651gR93hDAGiTCYhmhh'
});

test('Invalid object repository', function () {
    const result = () => new TokenAuthentication(
        {},
        {}
    );
    expect(result).toThrowError('Invalid repository dependency');
});

test('Invalid object web token', function () {
    const result = () => new TokenAuthentication(
        TokenRepositoryMock,
        {}
    );
    expect(result).toThrowError('Invalid token dependency');
});

test('Invalid object token', function () {
    const result = async () => await tokenAuthentication.authenticate({});
    expect(result).rejects.toThrow('Invalid token object!');
});

test('Throw exception get user', function () {
    TokenRepositoryMock.throwException = true;
    const result = async () => await tokenAuthentication.authenticate(token);
    expect(result).rejects.toThrow('Invalid database connection!');
});

test('Throw exception get empty user', function () {
    TokenRepositoryMock.throwException = false;
    TokenRepositoryMock.returnEmpty = true;
    const result = async () => await tokenAuthentication.authenticate(token);
    expect(result).rejects.toThrow('Tokens sent are invalids. Try again!');
});

test('Throw exception invalid user object', function () {
    TokenRepositoryMock.returnEmpty = false;
    TokenRepositoryMock.returnEmptyObj = true;
    const result = async () => await tokenAuthentication.authenticate(token);
    expect(result).rejects.toThrow('Invalid user instance!');
});

test('Throw exception token expired', function () {
    TokenRepositoryMock.returnEmptyObj = false;
    TokenRepositoryMock.throwExceptionTokenExpired = true;
    const result = async () => await tokenAuthentication.authenticate(token);
    expect(result).rejects.toThrow('Token expired. Try login again!');
});

test('Throw exception update user', function () {
    TokenRepositoryMock.throwExceptionTokenExpired = false;
    TokenRepositoryMock.throwExceptionUpdate = true;
    const result = async () => await tokenAuthentication.authenticate(token);
    expect(result).rejects.toThrow('Generic error, check the integrations!');
});

test('Throw exception generate web token', function () {
    TokenRepositoryMock.throwExceptionUpdate = false;
    WebTokenMock.throwException = true
    const result = async () => await tokenAuthentication.authenticate(token);
    expect(result).rejects.toThrow('Generic error, check the integrations!');
});

test('Generate token', async () => {
    const expected = '763a5b89-9c96-4f9b-8daa-0b411c7c671e';
    WebTokenMock.throwException = false;
    const result = await tokenAuthentication.authenticate(token);

    assert.equal(result, expected);
});