const Joi = require('joi');
const failAction = (request, h, err) => {
    request.log('error', err);
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
        handler: (request, h) => {
            return request.payload;
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
        handler: (request, h) => {
            return request.payload;
        }
    },

]

module.exports = {
    routes
}