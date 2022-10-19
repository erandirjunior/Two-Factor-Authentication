const Short = require('short-uuid');
const IToken = require('../../domain/itoken.js');

module.exports = class TokenService extends IToken {
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