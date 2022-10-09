const User = require('./user');
const IRepository = require('./irepository');
const IEmail = require('./iemail');
const IPasswordHash = require('./ipassword-hash');
const IToken = require('./itoken');
const UserRegistered = require('./user-registered');

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
        this.#validateDependencies(repository, emailGateway, passwordHash, tokenService);
        this.#repository = repository;
        this.#emailGateway = emailGateway;
        this.#passwordHash = passwordHash;
        this.#tokenService = tokenService;
    }

    #validateDependencies(repository, emailGateway, passwordHash, tokenService) {
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

        try {
            const updatedUser = this.#getUserWithUpdatedData(userRegistered);
            await this.#repository.update(updatedUser);
            await this.#emailGateway.send(updatedUser);
            return updatedUser.token;
        } catch (error) {
            throw Error(error);
        }
    }

    #validateUserDataInput(user) {
        if (!this.#isInstanceOf(user, User)) {
            throw Error('Invalid object user');
        }
    }

    async getUserRegistered(user) {
        let userRegistered = null;

        try {
            userRegistered = await this.#repository.findByEmail(user.email);
        } catch (e) {
            throw Error('User not found!');
        }

        return this.#getUserValidated(userRegistered, user);
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

    #getUserWithUpdatedData(user) {
        const {token, emailToken} = this.#getTokens();
        const expireDateToken = this.#getExpireDateToken();
        return new UserRegistered({
            id: user.id,
            email: user.email,
            emailToken: emailToken,
            token: token,
            password: user.password,
            expireDate: expireDateToken
        });
    }

    #getExpireDateToken() {
        const date = new Date();
        date.setMinutes(date.getMinutes() + 15);
        return date;
    }
}
