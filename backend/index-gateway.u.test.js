const indexGateway = require('./index-gateway.js');

test('Index gateway can be loaded', async () => {
    expect(typeof indexGateway.handler).toBe('function');
});

test('Index gateway can handle a request that doesn’t match any route.', async () => {
    /* Arrange */
    const event = {
        path: '',
        httpMethod: '',
        headers: {},
        queryStringParameters: {environment: 'development'},
    };
    const context = {functionName: ''};

    /* Act */
    // noinspection JSCheckFunctionSignatures
    const result = await indexGateway.handler(event, context);

    /* Assert */
    expect(result.statusCode).toBe(405);
});

test('Index gateway can handle getVersion requests without authentication.', async () => {
    /* Arrange */
    const event = {
        path: '',
        httpMethod: 'GET',
        headers: {},
        queryStringParameters: {environment: 'development'},
    };
    const context = {functionName: 'photato-website-backend-development-getVersion'};

    /* Act */
    // noinspection JSCheckFunctionSignatures
    const result = await indexGateway.handler(event, context);

    /* Assert */
    expect(result.statusCode).toBe(401); /* Invalid auth0 token */
});

test('Index gateway can handle getAllMessages OPTIONS request.', async () => {
    /* Arrange */
    const event = {
        path: '',
        httpMethod: 'OPTIONS',
        headers: {},
        queryStringParameters: {environment: 'development'},
    };
    const context = {functionName: 'photato-website-backend-development-adminGetAllMessages'};

    /* Act */
    // noinspection JSCheckFunctionSignatures
    const result = await indexGateway.handler(event, context);

    /* Assert */
    expect(result.statusCode).toBe(200); /* Success */
});