import Hapi from '@hapi/hapi';
import Vision from '@hapi/vision';
import Inert from '@hapi/inert';
import HapiSwagger from 'hapi-swagger';
import routes from './routes.js';

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
    return server;
};

export default init;