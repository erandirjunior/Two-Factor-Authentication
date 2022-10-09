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
        this.#validateDependencies(repository, emailGateway, passwordHash, tokenService);
        this.#repository = repository;
        this.#emailGateway = emailGateway;
        this.#passwordHash = passwordHash;
        this.#tokenService = tokenService;
    }

    #validateDependencies(repository, emailGateway, passwordHash, tokenService) {
        if (!this.#isInstanceOf(repository, IRepository)) {
            throw Error('Invalid repository dependency');
        }

        if (!this.#isInstanceOf(emailGateway, IEmail)) {
            throw Error('Invalid gateway dependency');
        }

        if (!this.#isInstanceOf(passwordHash, IPasswordHash)) {
            throw Error('Invalid hash dependency');
        }

        if (!this.#isInstanceOf(tokenService, IToken)) {
            throw Error('Invalid token dependency');
        }
    }

    async authenticate(userLoginData) {
        this.#validateUserDataInput(userLoginData);
        const registeredUser = await this.getUserRegistered(userLoginData);

        try {
            const user = this.#getUserWithUpdatedData(registeredUser);
            await this.#repository.update(user);
            await this.#emailGateway.send(user);
            return user.token;
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
        let registeredUser = null;

        try {
            registeredUser = await this.#repository.findByEmail(user.email);
        } catch (e) {
            throw Error('User not found!');
        }

        return this.#getUserValidated(registeredUser, user);
    }

    #getUserValidated(registeredUser, user) {
        if (!this.#isInstanceOf(registeredUser, User) || !registeredUser.id) {
            throw Error('Invalid user instance');
        }

        if (!this.#isValidPassword(user.password, registeredUser.password)) {
            throw Error('Invalid password!');
        }

        return registeredUser;
    }

    #isValidPassword(user, password) {
        return this.#passwordHash.isEqual(user, password);
    }

    #getTokens() {
        return {
            token: this.#tokenService.getToken(),
            emailToken: this.#tokenService.getEmailToken()
        }
    }

    #isInstanceOf(object, instanceBase) {
        return object instanceof instanceBase;
    }

    #getUserWithUpdatedData(user) {
        return new User({
            id: user.id,
            email: user.email,
            ...this.#getTokens(),
            password: user.password,
            expireDate: this.#getExpireDateToken()
        });
    }

    #getExpireDateToken() {
        const date = new Date();
        date.setMinutes(date.getMinutes() + 15);
        return date;
    }
}
