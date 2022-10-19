const { config } = require('dotenv');

const loadEnv = () => {
    const env = process.env.NODE_ENV || '';

    const configPath = `.env${env}`;

    const result = config({
        path: configPath
    });

    if (result.error) {
        throw result.error
    }
}

module.exports = {
    loadEnv
};