import Joi from 'joi';
import InvalidArgumentError from './../../../domain/invalid-argument-error.js';
import GatewayError from './../../../domain/gateway-error.js';
import Boom from '@hapi/boom';
import createUserAuthentication from '../../actions/user-authentication-action.js';
import createTokenAuthentication from '../../actions/token-authentication-action.js';

const handlerError = (error) => {
    if (error instanceof GatewayError) {
        return Boom.badGateway(error.message);
    }

    if (error instanceof InvalidArgumentError) {
        return Boom.badRequest(error.message);
    }

    return Boom.badImplementation(error);
}

const failAction = (request, h, err) => {
    throw err;
};

const routes = [
    {
        options: {
            tags: ['api'],
            description: 'Get temporary token',
            notes: 'Login with email and password',
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
                const result = await createUserAuthentication(payload);
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
            tags: ['api'],
            description: 'Login in the application',
            notes: 'Login with token and the token receive in e-mail',
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
                const result = await createTokenAuthentication(payload);
                return {
                    token: result
                };
            } catch (e) {
                return handlerError(e);
            }
        }
    }
]

export default routes;