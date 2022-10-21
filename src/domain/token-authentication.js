const IToken = require('./itoken');
const ITokenRepository = require('./itoken-repository');
const Token = require('./token');
const { isInstanceOf } = require('./instanceof');
const DomainError = require('./domain-error');
const GatewayError = require('./gateway-error');
const InvalidArgumentError = require('./invalid-argument-error');
const throwError = require('./throw-error');

module.exports = class TokenAuthentication {
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

        if (!user) {
            throwError(InvalidArgumentError, 'User not found!');
        }

        if (user.expired) {
            throwError(DomainError, 'Token expired. Try login again!');
        }

        try {
            await this.#repository.updateExpiredFieldToTrue(user.id);
            return this.#webToken.generateWebToken(user);
        } catch (error) {
            throwError(GatewayError, 'Generic error, check the integrations!');
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
