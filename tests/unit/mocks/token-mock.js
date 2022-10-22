import IGenerateToken from '../../../src/domain/igenerate-token.js';

class TokenMock extends IGenerateToken {
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

export default new TokenMock();