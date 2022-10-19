const Hapi = require('@hapi/hapi');
const { routes } = require('./routes');

const init = async () => {
    const server = Hapi.server({
        port: process.env.APP_PORT,
    });

    server.route(routes);

    await server.start();
    console.log('Server running on %s', server.info.uri);
};

module.exports = {
    init
}