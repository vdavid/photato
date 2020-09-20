const Router = require('./Router.js');

const appName = 'test-app';
const router = new Router({appName});

test('Can resolve routes', async () => {
    /* Arrange */
    const postHandler = jest.fn(() => 555);
    const getHandler = jest.fn(() => 555);
    const optionsHandler = jest.fn(() => 555);
    const middleware1 = jest.fn(() => undefined);
    const middleware2 = jest.fn(() => undefined);
    const routes = [
        {functionName: 'otherFunction', method: 'POST', middlewareSequence: [postHandler]},
        {functionName: 'testFunction', method: 'POST', middlewareSequence: [middleware1, postHandler]},
        {functionName: 'testFunction', method: 'GET', middlewareSequence: [middleware2, getHandler]},
        {functionName: 'testFunction', method: 'OPTIONS', middlewareSequence: [optionsHandler]},
    ];
    const event = {
        path: '/testFunction',
        httpMethod: 'GET',
        headers: {Host: 'aa.com', Authorization: 'Bearer token'},
        queryStringParameters: {a: 5, environment: 'staging'},
    };
    const context = {functionName: 'test-app-staging-testFunction'};

    /* Act */
    // noinspection JSCheckFunctionSignatures
    const result = await router.resolveRoutes(event, context, routes);

    /* Assert */
    expect(middleware1.mock.calls.length).toBe(0);
    expect(middleware2.mock.calls.length).toBe(1);
    expect(postHandler.mock.calls.length).toBe(0);
    expect(getHandler.mock.calls.length).toBe(1);
    expect(optionsHandler.mock.calls.length).toBe(0);
    expect(result).toBe(555);
});

test('Fails on wrong environment', async () => {
    /* Arrange */
    const handler = jest.fn(() => 555);
    const routes = [
        {functionName: 'testFunction', method: 'GET', middlewareSequence: [handler]},
    ];
    const event = {
        path: '/testFunctionPath',
        httpMethod: 'GET',
        headers: {Host: 'aa.com', Authorization: 'Bearer token'},
        queryStringParameters: {a: 5},
    };
    const context = {functionName: 'test-app-staging-testFunction'};

    /* Act */
    // noinspection JSCheckFunctionSignatures
    const result = await router.resolveRoutes(event, context, routes);

    /* Assert */
    expect(handler.mock.calls.length).toBe(0);
    expect(result.statusCode).toBe(400);
});

test('Stops on middleware with output', async () => {
    /* Arrange */
    const middleware = jest.fn(() => 222);
    const getHandler = jest.fn(() => 555);
    const routes = [
        {functionName: 'testFunction', method: 'GET', middlewareSequence: [middleware, getHandler]},
    ];
    const event = {
        path: '/testFunction',
        httpMethod: 'GET',
        headers: {Host: 'aa.com', Authorization: 'Bearer token'},
        queryStringParameters: {a: 5, environment: 'staging'},
    };
    const context = {functionName: 'test-app-staging-testFunction'};

    /* Act */
    // noinspection JSCheckFunctionSignatures
    const result = await router.resolveRoutes(event, context, routes);

    /* Assert */
    expect(middleware.mock.calls.length).toBe(1);
    expect(getHandler.mock.calls.length).toBe(0);
    expect(result).toBe(222);
});

module.exports = Router;