const IRepository = require('./../../domain/irepository');
const ITokenRepository = require('./../../domain/itoken-repository');
const User = require('./../../domain/user');

class Repository extends IRepository {
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
            throw Error('Error find user');
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

module.exports = {
    Repository
}