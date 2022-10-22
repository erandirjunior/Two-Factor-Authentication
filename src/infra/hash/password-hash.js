import IPasswordHash from './../../domain/ipassword-hash.js';
import Bcrypt from 'bcrypt';
import { promisify } from 'util';
const compareAsync = promisify(Bcrypt.compare);

export default class PasswordHash extends IPasswordHash {
    constructor() {
        super();
    }

    compare(password, hash) {
        return compareAsync(password, hash);
    }
}