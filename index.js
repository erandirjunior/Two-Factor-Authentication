import loadEnv from './src/infra/env/load-env.js';
import init from './src/infra/http/hapi/server.js';

async function run() {
    await loadEnv();
    await init();
}

run();