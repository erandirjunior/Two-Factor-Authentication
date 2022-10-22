import Short from 'short-uuid';
import IGenerateToken from '../../domain/igenerate-token.js';

export default class TokenService extends IGenerateToken {
    constructor() {
        super();
    }

    getToken() {
        return Short.uuid();
    }

    getEmailToken() {
        return Short.generate();
    }
}