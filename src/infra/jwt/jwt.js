const IToken = require('./../../domain/itoken');
const JWT = require('jsonwebtoken');

module.exports = class Jwt extends IToken {
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