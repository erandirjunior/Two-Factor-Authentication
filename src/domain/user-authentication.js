const User = require('./user');
const IRepository = require('./irepository');
const IEmail = require('./iemail');
const IPasswordHash = require('./ipassword-hash');
const IGenerateToken = require('./igenerate-token');
const LoginPayload = require('./login-payload');
const { isInstanceOf } = require('./instanceof');
const DomainError = require('./domain-error');
const GatewayError = require('./gateway-error');
const InvalidArgumentError = require('./invalid-argument-error');
const throwError = require('./throw-error');

module.exports = class UserAuthentication {
    #repository;
    #emailGateway;
    #hashService;
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
        this.#hashService = passwordHash;
        this.#tokenService = tokenService;
    }

    #validateDependencies(repository, emailGateway, passwordHash, tokenService) {
        if (!this.#isInstanceOf(repository, IRepository)) {
            throwError(DomainError, 'Invalid repository dependency');
        }

        if (!this.#isInstanceOf(emailGateway, IEmail)) {
            throwError(DomainError, 'Invalid gateway dependency');
        }

        if (!this.#isInstanceOf(passwordHash, IPasswordHash)) {
            throwError(DomainError, 'Invalid hash dependency');
        }

        if (!this.#isInstanceOf(tokenService, IGenerateToken)) {
            throwError(DomainError, 'Invalid token dependency');
        }
    }

    async authenticate(loginPayload) {
        this.#validateUserDataInput(loginPayload);
        const registeredUser = await this.getUserRegistered(loginPayload);

        try {
            const user = this.#getUserWithUpdatedData(registeredUser);
            await this.#repository.update(user);
            this.#emailGateway.send(user);
            return user.token;
        } catch (error) {
            throwError(GatewayError, 'Generic error, see the integrations!');
        }
    }

    #validateUserDataInput(loginPayload) {
        if (!this.#isInstanceOf(loginPayload, LoginPayload)) {
            throwError(DomainError, 'Invalid payload dependency');
        }
    }

    async getUserRegistered(user) {
        let registeredUser = null;

        try {
            registeredUser = await this.#repository.findByEmail(user.email);
        } catch (e) {
            throwError(GatewayError, 'Error connection database!');
        }

        return this.#getUserValidated(registeredUser, user);
    }

    async #getUserValidated(registeredUser, user) {
        if (!registeredUser) {
            throwError(InvalidArgumentError, 'User not found with data sent!');
        }

        if (!this.#isInstanceOf(registeredUser, User)) {
            throwError(DomainError, 'Invalid user instance');
        }

        const passwordsAreEquals = await this.#hashService.compare(user.password, registeredUser.password);

        if (!passwordsAreEquals) {
            throwError(InvalidArgumentError, 'Invalid user data!');
        }

        return registeredUser;
    }

    #isInstanceOf(object, instanceBase) {
        return isInstanceOf(object, instanceBase);
    }

    #getUserWithUpdatedData(user) {
        return new User({
            id: user.id,
            email: user.email,
            ...this.#getTokens(),
            password: user.password,
            expired: false
        });
    }

    #getTokens() {
        return {
            token: this.#tokenService.getToken(),
            emailToken: this.#tokenService.getEmailToken()
        }
    }
}
