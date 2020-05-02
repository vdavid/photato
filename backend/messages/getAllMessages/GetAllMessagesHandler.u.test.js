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
const photatoMessageRepository = {getAllMessages: () => mockMessages};
const getAllMessagesHandler = new GetAllMessagesHandler({auth0Authorizer, permissionHelper, photatoMessageRepository});

function _convertToQueryString(object) {
    return Object.keys(object).map(key => key + '=' + object[key]).join('&');
}

test('Handles valid OPTIONS requests well', async () => {
    /* Arrange */
    const host = 'temp.cloudfront.net';
    const event = {
        Records: [
            {
                cf: {
                    request: {
                        headers: {
                            host: [
                                {key: 'Host', value: host},
                            ],
                        },
                        method: 'OPTIONS',
                        uri: '/get-all-messages',
                    },
                },
            },
        ],
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

function createGetEvent(emailAddress) {
    const host = 'temp.cloudfront.net';
    const parameters = {
        environment: 'development',
        emailAddress: emailAddress,
        courseName: 'hu-3',
        weekIndex: '2',
        originalFileName: 'kukutyin.jpg',
        title: 'Test title',
        mimeType: 'image/jpeg',
    };
    return {
        Records: [
            {
                cf: {
                    request: {
                        headers: {
                            host: [
                                {key: 'Host', value: host},
                            ],
                            authorization: [
                                {key: 'Authorization', value: 'Bearer ' + ((emailAddress === adminEmailAddress) ? adminBearerToken : ordinaryBearerToken)},
                            ],
                        },
                        method: 'GET',
                        querystring: _convertToQueryString(parameters),
                        uri: '/get-all-messages',
                    },
                },
            },
        ],
    };
}
