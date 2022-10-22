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
// expect(result).rejects.toThrow('Invalid token object!');

test('Invalid object repository', function () {
    const result = () => new UserAuthentication(
        {},
        EmailMock,
        HashMock,
        TokenMock
    );
    expect(result).toThrow('Invalid repository dependency');
});

test('Invalid object email', function () {
    const result = () => new UserAuthentication(
        RepositoryMock,
        {},
        HashMock,
        TokenMock
    );
    expect(result).toThrow('Invalid email gateway dependency');
});

test('Invalid object hash', function () {
    const result = () => new UserAuthentication(
        RepositoryMock,
        EmailMock,
        {},
        TokenMock
    );
    expect(result).toThrow('Invalid hash service dependency');
});

test('Invalid object token', function () {
    const result = () => new UserAuthentication(
        RepositoryMock,
        EmailMock,
        HashMock,
        {}
    );
    expect(result).toThrow('Invalid token service dependency');
});

test('Invalid object login payload', async () => {
    const result = async () => await userAuthentication.authenticate({});
    expect(result).rejects.toThrow('Invalid payload dependency');
});

test('Error exception find user', async () => {
    RepositoryMock.throwException = true;
    const result = async () => await userAuthentication.authenticate(payload);
    expect(result).rejects.toThrow('Error connection database!');
});

test('Error find user empty', async () => {
    RepositoryMock.throwException = false;
    RepositoryMock.returnEmpty = true;
    const result = async () => await userAuthentication.authenticate(payload);
    expect(result).rejects.toThrow('User not found with data sent!');
});

test('Error user without id', async () => {
    RepositoryMock.returnEmpty = false;
    RepositoryMock.returnEmptyObject = true;
    const result = async () => await userAuthentication.authenticate(payload);
    expect(result).rejects.toThrow('Invalid user instance!');
});

test('Error update user', async () => {
    RepositoryMock.returnEmptyObject = false;
    RepositoryMock.throwExceptionUpdate = true;
    const result = async () => await userAuthentication.authenticate(payload);
    expect(result).rejects.toThrow('Generic error, see the integrations!');
});

test('Error email exception', async () => {
    RepositoryMock.throwExceptionUpdate = false;
    EmailMock.throwException = true;
    const result = async () => await userAuthentication.authenticate(payload);
    expect(result).rejects.toThrow('Generic error, see the integrations!');
});

test('Error user divergent password', async () => {
    EmailMock.throwException = false;
    HashMock.passwordsAreEquals = false;
    const result = async () => await userAuthentication.authenticate(payload);
    expect(result).rejects.toThrow('Invalid user data!');
});

test('Get token', async () => {
    HashMock.passwordsAreEquals = true;
    const result = await userAuthentication.authenticate(payload);
    expect(result).toBe('13eb4cb6-35dd-4536-97e6-0ed0e4fb1fb3');
});