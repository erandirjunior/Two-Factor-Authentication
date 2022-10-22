import IToken from './itoken.js';
import ITokenRepository from './itoken-repository.js';
import Token from './token.js';
import isInstanceOf from './instanceof.js';
import DomainError from './domain-error.js';
import GatewayError from './gateway-error.js';
import InvalidArgumentError from './invalid-argument-error.js';
import throwError from './throw-error.js';
import User from './user.js';

export default class TokenAuthentication {
    #repository;
    #webToken;

    constructor(repository, webToken) {
        this.#validateDependencies(repository, webToken)
        this.#repository = repository;
        this.#webToken = webToken;
    }

    #validateDependencies(repository, webToken) {
        if (!this.#isInstanceOf(repository, ITokenRepository)) {
            throwError(DomainError, 'Invalid repository dependency');
        }

        if (!this.#isInstanceOf(webToken, IToken)) {
            throwError(DomainError, 'Invalid token dependency');
        }
    }

    async authenticate(token) {
        this.#throwExceptionIfTokenIsInvalid(token);
        const user = await this.#getUser(token);
        this.#throwExceptionIfInvalidUser(user);

        try {
            await this.#repository.updateExpiredFieldToTrue(user.id);
            return this.#webToken.generateWebToken(user);
        } catch (error) {
            throwError(GatewayError, 'Generic error, check the integrations!');
        }
    }

    #throwExceptionIfInvalidUser(user) {
        if (!user) {
            throwError(InvalidArgumentError, 'Tokens sent are invalids. Try again!');
        }

        if (!isInstanceOf(user, User)) {
            throwError(DomainError, 'Invalid user object!');
        }

        if (user.expired) {
            throwError(InvalidArgumentError, 'Token expired. Try login again!');
        }
    }

    async #getUser(token) {
        try {
            return await this.#repository.findByToken(token);
        } catch (e) {
            throwError(GatewayError, 'Invalid database connection!');
        }
    }

    #throwExceptionIfTokenIsInvalid(token) {
        if (!this.#isInstanceOf(token, Token)) {
            throwError(DomainError, 'Invalid token object!');
        }
    }

    #isInstanceOf(object, instanceBase) {
        return isInstanceOf(object, instanceBase)
    }
}
