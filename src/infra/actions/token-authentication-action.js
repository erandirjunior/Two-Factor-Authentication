const { loadModel } = require('../persistence/model');
const { TokenRepository } = require('../persistence/repository');
const TokenAuthentication = require('../../domain/token-authentication');
const Jwt = require('../jwt/jwt');
const Token = require('../../domain/token');


const createTokenAuthentication = async (payload) => {
    const userModel = await loadModel();
    const repository = new TokenRepository(userModel);
    const tokenAuthentication = new TokenAuthentication(
        repository,
        new Jwt()
    );

    const token = new Token(payload);
    return await tokenAuthentication.authenticate(token);
}

module.exports = createTokenAuthentication;