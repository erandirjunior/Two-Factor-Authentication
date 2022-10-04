const User = require('./user');
const IRepository = require('./irepository');
const IEmail = require('./iemail');
const IPasswordHash = require('./ipassword-hash');
const IToken = require('./itoken');

module.exports = class UserAuthentication {
    #repository;
    #emailGateway;
    #passwordHash;
    #tokenService;

    constructor(
        repository,
        emailGateway,
        passwordHash,
        tokenService
    ) {
        this.#validateDependecies(repository, emailGateway, passwordHash, tokenService);
        this.#repository = repository;
        this.#emailGateway = emailGateway;
        this.#passwordHash = passwordHash;
        this.#tokenService = tokenService;
    }

    #validateDependecies(repository, emailGateway, passwordHash, tokenService) {
        if (!this.#isInstanceOf(repository, IRepository)) {
            throw Error('Invalid object repository');
        }

        if (!this.#isInstanceOf(emailGateway, IEmail)) {
            throw Error('Invalid object gateway');
        }

        if (!this.#isInstanceOf(passwordHash, IPasswordHash)) {
            throw Error('Invalid object hash');
        }

        if (!this.#isInstanceOf(tokenService, IToken)) {
            throw Error('Invalid object token');
        }
    }

    async authenticate(user) {
        this.#validateUserDataInput(user);

        const userRegistered = await this.getUserRegistered(user);
        const {token, emailToken} = this.#getTokens();

        try {
            await this.#repository.updateToken(userRegistered, token, emailToken);
            await this.#emailGateway.send(userRegistered, token, emailToken);
            return token;
        } catch (error) {
            throw Error(error);
        }
    }

    async getUserRegistered(user) {
        let userRegistered = null;

        try {
            userRegistered = await this.#repository.findByEmail(user.email);
        } catch (e) {
            throw Error(e);
        }

        return this.#getUserValidated(userRegistered, user);
    }

    #validateUserDataInput(user) {
        if (!this.#isInstanceOf(user, User)) {
            throw Error('Invalid object user');
        }
    }

    #getUserValidated(userRegistered, user) {
        if (!userRegistered || !userRegistered.id) {
            throw Error('User not found!');
        }

        if (!this.#isValidPassword(user.password, userRegistered.password)) {
            throw Error('Invalid password!');
        }

        return userRegistered;
    }

    #isValidPassword(user, password) {
        return this.#passwordHash.isEqual(user, password);
    }

    #getTokens() {
        const token = this.#tokenService.getToken();
        const emailToken = this.#tokenService.getEmailToken();
        return {token, emailToken};
    }

    #isInstanceOf(object, instanceBase) {
        return object instanceof instanceBase;
    }
}
