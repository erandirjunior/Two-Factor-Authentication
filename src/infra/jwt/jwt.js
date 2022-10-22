import IToken from './../../domain/itoken.js';
import JWT from 'jsonwebtoken';

export default class Jwt extends IToken {
    constructor() {
        super();
    }

    generateWebToken(user) {
        const token = JWT.sign({
            id: user.id,
            email: user.email,
        }, process.env.JWT_SECRET);

        return token;
    }
}