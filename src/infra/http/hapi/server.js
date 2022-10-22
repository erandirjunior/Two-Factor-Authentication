const Hapi = require('@hapi/hapi');
const Vision = require('@hapi/vision');
const Inert = require('@hapi/inert');
const HapiSwagger = require('hapi-swagger');
const { routes } = require('./routes');

const init = async () => {
    const server = Hapi.server({
        port: process.env.APP_PORT,
    });

    const swaggerOptions = {
        info: {
            title: 'API Two-Factor Authentication',
            version: 'v1.0',
        }
    };

    await server.register([
        Inert,
        Vision,
        {
            plugin: HapiSwagger,
            options: swaggerOptions
        }
    ]);

    server.route(routes);

    await server.start();
    console.log('Server running on %s', server.info.uri);
};

module.exports = {
    init
}