const IToken = require('./itoken');
const ITokenRepository = require('./itoken-repository');
const Token = require('./token');
const { isInstanceOf } = require('./instanceof');

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
            throw Error('Invalid dependency repository');
        }

        if (!this.#isInstanceOf(webToken, IToken)) {
            throw Error('Invalid dependency token');
        }
    }

    async authenticate(token) {
        this.#throwExceptionIfTokenIsInvalid(token);
        const user = await this.#getUser(token);

        if (user.expired) {
            throw Error('Token expired. Try login again!');
        }

        try {
            await this.#repository.updateExpiredFieldToTrue(user.id);
            return this.#webToken.generateWebToken(user);
        } catch (error) {
            throw Error(error);
        }
    }

    async #getUser(token) {
        try {
            return await this.#repository.findByToken(token);
        } catch (e) {
            throw Error(e);
        }
    }

    #throwExceptionIfTokenIsInvalid(token) {
        if (!this.#isInstanceOf(token, Token)) {
            throw Error('Invalid token object!');
        }
    }

    #isInstanceOf(object, instanceBase) {
        return isInstanceOf(object, instanceBase)
    }
}
