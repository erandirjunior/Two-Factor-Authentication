const Short = require('short-uuid');
const IGenerateToken = require("../../domain/igenerate-token");

module.exports = class TokenService extends IGenerateToken {
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