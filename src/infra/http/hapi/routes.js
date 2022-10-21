const Joi = require('joi');
const InvalidArgumentError = require('./../../../domain/invalid-argument-error');
const GatewayError = require('./../../../domain/gateway-error');
const UserAuthentication = require('./../../../domain/user-authentication');
const TokenAuthentication = require('./../../../domain/token-authentication');
const LoginPayload = require('./../../../domain/login-payload');
const { Repository, TokenRepository } = require('./../../persistence/repository');
const { loadModel } = require('./../../persistence/model');
const PasswordHash = require('./../../hash/password-hash');
const TokenService = require('./../../token/token-service');
const Jwt = require('./../../jwt/jwt');
const Token = require('./../../../domain/token');
const Boom = require('@hapi/boom');
const Email = require('./../../email/email');

const createUserAuthentication = async () => {
    const userModel = await loadModel();
    const repository = new Repository(userModel);
    return new UserAuthentication(
        repository,
        new Email(),
        new PasswordHash(),
        new TokenService()
    );
}

const handlerError = (error) => {
    if (error instanceof GatewayError) {
        return Boom.badGateway(error.message);
    }

    if (error instanceof InvalidArgumentError) {
        return Boom.badRequest(error.message);
    }

    return Boom.badImplementation();
}

const createTokenAuthentication = async () => {
    const userModel = await loadModel();
    const repository = new TokenRepository(userModel);
    return new TokenAuthentication(
        repository,
        new Jwt()
    );
}

const failAction = (request, h, err) => {
    throw err;
};

const routes = [
    {
        options: {
            validate: {
                payload: Joi.object({
                    email: Joi.string().email().required(),
                    password: Joi.string().min(6).required()
                }),
                failAction
            }
        },
        method: 'POST',
        path: '/login',
        handler: async (request, h) => {
            try {
                const { payload } = request;
                const userAuthentication = await createUserAuthentication();
                const loginPayload = new LoginPayload(payload.email, payload.password);
                const result = await userAuthentication.authenticate(loginPayload);
                return {
                    token: result
                };
            } catch (e) {
                return handlerError(e);
            }
        }
    },
    {
        options: {
            validate: {
                payload: Joi.object({
                    token: Joi.string().min(35).required(),
                    emailToken: Joi.string().min(22).required()
                }),
                failAction
            }
        },
        method: 'POST',
        path: '/token',
        handler: async (request, h) => {
            try {
                const { payload } = request;
                const tokenAuthentication = await createTokenAuthentication();
                const token = new Token(payload);
                const result = await tokenAuthentication.authenticate(token);

                return {
                    token: result
                };
            } catch (e) {
                return handlerError(e);
            }
        }
    },

]

module.exports = {
    routes
}