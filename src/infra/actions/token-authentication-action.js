import loadModel from '../persistence/model.js';
import { TokenRepository } from '../persistence/repository.js';
import TokenAuthentication from '../../domain/token-authentication.js';
import Jwt from '../jwt/jwt.js';
import Token from '../../domain/token.js';


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

export default createTokenAuthentication;