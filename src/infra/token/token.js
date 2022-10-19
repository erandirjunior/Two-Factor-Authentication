const Short = require('short-uuid');
const IToken = require('../../domain/itoken.js');

class Token extends IToken {
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