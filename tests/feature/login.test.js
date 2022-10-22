import loadEnv from '../../src/infra/env/load-env.js';
import init from '../../src/infra/http/hapi/server.js';
let api = {};
let token = {};
let user = {
    email: 'email@email.com',
    password: '123456'
}
import Bcrypt from 'bcrypt';
import loadModel from '../../src/infra/persistence/model.js';
let model = {};
beforeAll(async () => {
    await loadEnv();
    api = await init();
    model = await loadModel();
    const pass = await Bcrypt.hash(user.password, 3);
    await model.destroy({ where : { email: user.email }});
    await model.create({
        email: user.email,
        password: pass
    });
});

test('Should get token', async () => {
    const result = await api.inject({
        method: 'POST',
        url: '/login',
        payload: user
    });
    const data = JSON.parse(result.payload);
    token = data.token;
    expect(token.length).toBeGreaterThan(35);
});

test('Should get jwt token', async () => {
    const user = await model.findOne({where: {token}, raw: true});
    const result = await api.inject({
        method: 'POST',
        url: '/token',
        payload: {
            token,
            emailToken: user.email_token
        }
    });
    const data = JSON.parse(result.payload);
    expect(data.token.length).toBeGreaterThan(40);
    expect(data.token).toBeTruthy();
    await model.destroy({ where : { email: user.email }});
});