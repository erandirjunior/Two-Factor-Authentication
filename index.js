const { loadEnv } = require('./src/infra/env/load-env');
const { init } = require('./src/infra/http/hapi/server');
const { Repository } = require("./src/infra/persistence/repository");
const { loadModel } = require("./src/infra/persistence/model");
// const Database = require('./src/infra/persistence/database');

async function run() {
    await loadEnv();
    init();
}

run();