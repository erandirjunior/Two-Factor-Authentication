const IToken = require('../../src/domain/itoken');

class TokenMock extends IToken {
    constructor() {
        super();
    }

    getToken() {
        return '13eb4cb6-35dd-4536-97e6-0ed0e4fb1fb3'
    }

    getEmailToken() {
        return  '4RV651gR93hDAGiTCYhmhh';
    }
}

module.exports = new TokenMock();