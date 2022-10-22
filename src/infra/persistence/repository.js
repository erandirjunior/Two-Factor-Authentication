import IRepository from './../../domain/irepository.js';
import ITokenRepository from './../../domain/itoken-repository.js';
import User from './../../domain/user.js';

export class Repository extends IRepository {
    #model;

    constructor(model) {
        super();
        this.#model = model
    }

    async findByEmail(email) {
        const result = await this.#model.findOne({ where: {
                email
            }
        });

        if (!result) {
            return undefined;
        }

        return new User({
            id: result.dataValues.id,
            token: result.dataValues.token,
            emailToken: result.dataValues.email_token,
            email: result.dataValues.email,
            password: result.dataValues.password,
        })
    }

    async update(user) {
        const data = {
            token: user.token,
            email_token: user.emailToken,
            expired: user.expired
        }

        await this.#model.update(data, {
            where: {
                id: user.id
            }
        });
    }
}

export class TokenRepository extends ITokenRepository {
    #model;

    constructor(model) {
        super();
        this.#model = model
    }

    updateExpiredFieldToTrue(id) {
        throw Error('Must be implemented');
    }

    async findByToken(token) {
        const result = await this.#model.findOne({ where: {
                token: token.token,
                email_token: token.emailToken,
            }
        });

        if (!result) {
            return undefined;
        }

        return new User({
            id: result.dataValues.id,
            token: result.dataValues.token,
            emailToken: result.dataValues.email_token,
            email: result.dataValues.email,
            password: result.dataValues.password,
            expired: result.dataValues.expired
        })
    }

    async updateExpiredFieldToTrue(id) {
        const data = {
            expired: true
        }

        await this.#model.update(data, {
            where: {
                id
            }
        });
    }
}