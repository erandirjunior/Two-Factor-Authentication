const { loadEnv } = require('./src/infra/env/load-env');
const { init } = require('./src/infra/http/hapi/server');
loadEnv();
init();