import IEmail from "./../../src/domain/iemail.js";
import IGenerateToken from '../../src/domain/igenerate-token.js';
import IPasswordHash from '../../src/domain/ipassword-hash.js';
import IRepository from '../../src/domain/irepository.js';
import ITokenRepository from '../../src/domain/itoken-repository.js';
import IToken from '../../src/domain/itoken.js';
import LoginPayload from '../../src/domain/login-payload.js';
import Token from '../../src/domain/token.js';
import User from '../../src/domain/user.js';
const email = new IEmail({});
const generateToken = new IGenerateToken({});
const passwordHash = new IPasswordHash();
const repository = new IRepository();
const tokenRepository = new ITokenRepository();
const tokenWeb = new IToken();

test('Error email not implemented', () => {
    const result = () => email.send();
    expect(result).toThrowError('Method must be implemented!');
});

test('Error get token not implemented', () => {
    const result = () => generateToken.getToken();
    expect(result).toThrowError('Method must be implemented!');
});

test('Error get email token implemented', () => {
    const result = () => generateToken.getEmailToken();
    expect(result).toThrowError('Method must be implemented!');
});

test('Error password compare not implemented', () => {
    const result = () => passwordHash.compare();
    expect(result).toThrowError('Method must be implemented!');
});

test('Error find by email not implemented', () => {
    const result = () => repository.findByEmail();
    expect(result).toThrowError('Method must be implemented!');
});

test('Error update not implemented', () => {
    const result = () => repository.update({});
    expect(result).toThrowError('Method must be implemented!');
});

test('Error find by token not implemented', () => {
    const result = () => tokenRepository.findByToken({});
    expect(result).toThrowError('Method must be implemented!');
});

test('Error update expire field not implemented', () => {
    const result = () => tokenRepository.updateExpiredFieldToTrue();
    expect(result).toThrowError('Method must be implemented!');
});

test('Error generate web token not implemented', () => {
    const result = () => tokenWeb.generateWebToken();
    expect(result).toThrowError('Method must be implemented!');
});

test('Error parameter did not send login payload object', () => {
    const result = () => new LoginPayload();
    expect(result).toThrowError('Fields email and password must be filled!');
});

test('Error parameter did not send to token object', () => {
    const result = () => new Token({});
    expect(result).toThrowError('Fields token and emailToken cannot be empty!');
});

test('Error parameter not send to user object', () => {
    const result = () => new User({});
    expect(result).toThrowError('Invalid user data!');
});