import { config } from 'dotenv';

const loadEnv = async () => {
    let env = '';

    if (process.env.NODE_ENV) {
        env = `.${process.env.NODE_ENV}`;
    }

    const configPath = `.env${env}`;

    const result = config({
        path: configPath
    });

    if (result.error) {
        throw result.error
    }
}

export default loadEnv;