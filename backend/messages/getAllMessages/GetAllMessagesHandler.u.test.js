/* Requires */
const GetAllMessagesHandler = require('./GetAllMessagesHandler.js');
const PermissionHelper = require('../../auth/PermissionHelper.js');

/* Constants */
const ordinaryEmailAddress = 'test@user.com';
const adminEmailAddress = 'veszelovszki@gmail.com';
const ordinaryBearerToken = 'ordinaryToken';
const adminBearerToken = 'adminToken';
const mockMessages = [{a: 1}, {a: 2}, {a: 3}];

/* External objects */
const auth0Authorizer = {
    getAuth0UserData: async (token) => token === adminBearerToken
        ? {email: adminEmailAddress}
        : (token === ordinaryBearerToken ? {email: ordinaryEmailAddress} : undefined)
};
const permissionHelper = new PermissionHelper();
// noinspection JSUnusedGlobalSymbols
const photatoMessageRepository = {getAllMessages: () => mockMessages};
// noinspection JSCheckFunctionSignatures
const getAllMessagesHandler = new GetAllMessagesHandler({auth0Authorizer, permissionHelper, photatoMessageRepository});

test('Handles valid OPTIONS requests well', async () => {
    /* Arrange */
    const host = 'temp.cloudfront.net';
    const event = {
        path: '/get-all-messages',
        httpMethod: 'OPTIONS',
        headers: {
            Host: host,
        },
    };

    /* Act */
    const response = await getAllMessagesHandler.handleRequest(event, {});

    /* Assert */
    expect(response.status).toEqual(200);
    expect(response.statusDescription).toEqual('OK');
    expect(response.body).toEqual(undefined);
});

test('Accepts valid GET requests for admins', async () => {
    /* Arrange */
    const event = createGetEvent(adminEmailAddress);

    /* Act */
    const response = await getAllMessagesHandler.handleRequest(event, {});

    /* Assert */
    expect(response.body).toEqual(JSON.stringify(mockMessages));
    expect(response.status).toEqual(200);
    expect(response.statusDescription).toEqual('OK');
});

test('Rejects GET requests for non-admins', async () => {
    /* Arrange */
    const event = createGetEvent(ordinaryEmailAddress);

    /* Act */
    const response = await getAllMessagesHandler.handleRequest(event, {});

    /* Assert */
    expect(response.body).toEqual('Not an admin.');
    expect(response.status).toEqual(403);
    expect(response.statusDescription).toEqual('Forbidden');
});

test('Rejects GET requests for invalid tokens', async () => {
    /* Arrange */
    const event = createGetEvent('unknown@email.address');

    /* Act */
    const response = await getAllMessagesHandler.handleRequest(event, {});

    /* Assert */
    expect(response.body).toEqual('Invalid auth0 token.');
    expect(response.status).toEqual(403);
    expect(response.statusDescription).toEqual('Forbidden');
});

function createGetEvent(emailAddress) {
    const host = 'temp.cloudfront.net';
    const parameters = {
        environment: 'development',
        emailAddress: emailAddress,
        courseName: 'hu-3',
        weekIndex: '2',
        originalFileName: 'kuk.jpg',
        title: 'Test title',
        mimeType: 'image/jpeg',
    };
    return {
        path: '/get-all-messages',
        httpMethod: 'GET',
        headers: {
            Host: host,
            Authorization: 'Bearer ' + ((emailAddress === adminEmailAddress) ? adminBearerToken
                : ((emailAddress === ordinaryEmailAddress) ? ordinaryBearerToken : '')),
        },
        queryStringParameters: parameters,
    };
}