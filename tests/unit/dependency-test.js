import IEmail from "./../../src/domain/iemail.js";
import IGenerateToken from '../../src/domain/igenerate-token.js';
import IPasswordHash from '../../src/domain/ipassword-hash.js';
import IRepository from '../../src/domain/irepository.js';
import ITokenRepository from '../../src/domain/itoken-repository.js';
import IToken from '../../src/domain/itoken.js';
import LoginPayload from '../../src/domain/login-payload.js';
import Token from '../../src/domain/token.js';
import User from '../../src/domain/user.js';
import assert from "assert";

const email = new IEmail({});
const generateToken = new IGenerateToken({});
const passwordHash = new IPasswordHash();
const repository = new IRepository();
const tokenRepository = new ITokenRepository();
const tokenWeb = new IToken();
const expected = Error;

describe('Test dependency class', function () {
    it('Error email not implemented', () => {
        const result = () => email.send();
        assert.throws(result, expected)
    });

    it('Error get token not implemented', () => {
        const result = () => generateToken.getToken();
        assert.throws(result, expected)
    });

    it('Error get token email implemented', () => {
        const result = () => generateToken.getEmailToken();
        assert.throws(result, expected)
    });

    it('Error password compare implemented', () => {
        const result = () => passwordHash.compare();
        assert.throws(result, expected)
    });

    it('Error find by email implemented', () => {
        const result = () => repository.findByEmail();
        assert.throws(result, expected)
    });

    it('Error update implemented', () => {
        const result = () => repository.update({});
        assert.throws(result, expected)
    });

    it('Error find by token implemented', () => {
        const result = () => tokenRepository.findByToken({});
        assert.throws(result, expected)
    });

    it('Error update expire field implemented', () => {
        const result = () => tokenRepository.updateExpiredFieldToTrue();
        assert.throws(result, expected)
    });

    it('Error generate implemented', () => {
        const result = () => tokenWeb.generateWebToken();
        assert.throws(result, expected)
    });

    it('Error parameter not send to login payload', () => {
        const result = () => new LoginPayload();
        assert.throws(result, expected)
    });

    it('Error parameter not send to token', () => {
        const result = () => new Token({});
        assert.throws(result, expected)
    });

    it('Error parameter not send to user', () => {
        const result = () => new User({});
        assert.throws(result, expected)
    });
});