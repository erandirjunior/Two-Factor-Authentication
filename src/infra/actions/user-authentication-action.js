import loadModel from '../persistence/model.js';
import { Repository } from '../persistence/repository.js';
import UserAuthentication from '../../domain/user-authentication.js';
import Email from '../email/email.js';
import PasswordHash from '../hash/password-hash.js';
import TokenService from '../token/token-service.js';
import LoginPayload from '../../domain/login-payload.js';

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

export default createUserAuthentication;