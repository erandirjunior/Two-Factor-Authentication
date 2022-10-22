import { Sequelize } from 'sequelize';

export default class Database {
    static connection;

    static async getConnection() {
        if (Database.connection) {
            return Database.connection;
        }

        const database = process.env.DB_DATABASE;
        const user = process.env.DB_USER;
        const password = process.env.DB_PASSWORD;
        const host = process.env.DB_HOST;
        const dialect = process.env.DB_DIALECT;

        const sequelize = new Sequelize(database, user, password, {
            host,
            dialect,
            logging: false
        });

        try {
            await sequelize.authenticate();
            console.log('Connection has been established successfully.');
            return sequelize;
        } catch (error) {
            console.error('Unable to connect to the database:', error);
        }
    }
}