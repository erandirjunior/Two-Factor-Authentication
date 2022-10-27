import User from './user.js';
import IRepository from './irepository.js';
import IEmail from './iemail.js';
import IPasswordHash from './ipassword-hash.js';
import IGenerateToken from './igenerate-token.js';
import LoginPayload from './login-payload.js';
import isInstanceOf from './instanceof.js';
import DomainError from './domain-error.js';
import GatewayError from './gateway-error.js';
import InvalidArgumentError from './invalid-argument-error.js';
import throwError from './throw-error.js';

export default class UserAuthentication {
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
            throwError(DomainError, 'Invalid email gateway dependency');
        }

        if (!this.#isInstanceOf(passwordHash, IPasswordHash)) {
            throwError(DomainError, 'Invalid hash service dependency');
        }

        if (!this.#isInstanceOf(tokenService, IGenerateToken)) {
            throwError(DomainError, 'Invalid token service dependency');
        }
    }

    async authenticate(loginPayload) {
        this.#validateUserDataInput(loginPayload);
        const registeredUser = await this.#getUserRegistered(loginPayload);

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

    async #getUserRegistered(user) {
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
            throwError(DomainError, 'Invalid user instance!');
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
