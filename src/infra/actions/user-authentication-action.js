const { loadModel } = require('../persistence/model');
const { Repository } = require('../persistence/repository');
const UserAuthentication = require('../../domain/user-authentication');
const Email = require('../email/email');
const PasswordHash = require('../hash/password-hash');
const TokenService = require('../token/token-service');
const LoginPayload = require('../../domain/login-payload');

const createUserAuthentication = async (payload) => {
    const userModel = await loadModel();
    const repository = new Repository(userModel);
    const userAuthentication = new UserAuthentication(
        repository,
        new Email(),
        new PasswordHash(),
        new TokenService()
    );

    const loginPayload = new LoginPayload(payload.email, payload.password);
    return await userAuthentication.authenticate(loginPayload);
}

module.exports = createUserAuthentication;