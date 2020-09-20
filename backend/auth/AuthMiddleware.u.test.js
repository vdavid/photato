const AuthMiddleware = require('./AuthMiddleware.js');
const RequestHelper = require('../http/RequestHelper.js');
const ResponseHelper = require('../http/ResponseHelper.js');
const {eventSources} = require('../http/eventSources.js');

const context = {functionName: 'testFunction'};

const ordinaryEmailAddress = 'test@user.com';
const adminEmailAddress = 'veszelovszki@gmail.com';
const ordinaryBearerToken = 'ordinaryToken';
const adminBearerToken = 'adminToken';

/* External objects */
const fakeAuthorizer = {
    authenticateByAccessToken: async (accessToken) => accessToken === adminBearerToken
        ? {emailAddress: adminEmailAddress, isAdmin: true}
        : (accessToken === ordinaryBearerToken ? {emailAddress: ordinaryEmailAddress, isAdmin: false} : undefined)
};
const responseHelper = new ResponseHelper(eventSources.APIGateway);
// noinspection JSCheckFunctionSignatures
const authMiddleware = new AuthMiddleware(fakeAuthorizer);

test('isUser accepts valid users', async () => {
    /* Arrange */
    // noinspection JSCheckFunctionSignatures
    const requestHelper = new RequestHelper(_createGetEvent(ordinaryEmailAddress), context);

    /* Act */
    const result = await authMiddleware.isUser(requestHelper, responseHelper);

    /* Assert */
    expect(result).toBe(undefined);
    expect(requestHelper.getUser().emailAddress).toBe(ordinaryEmailAddress);
    expect(requestHelper.getUser().isAdmin).toBe(false);
});
test('isUser rejects invalid users', async () => {
    /* Arrange */
    // noinspection JSCheckFunctionSignatures
    const requestHelper = new RequestHelper(_createGetEvent('unknown@email.address'), context);

    /* Act */
    const result = await authMiddleware.isUser(requestHelper, responseHelper);

    /* Assert */
    expect(result.statusCode).toBe(401);
});

test('isAdmin accepts admins', async () => {
    /* Arrange */
    // noinspection JSCheckFunctionSignatures
    const requestHelper = new RequestHelper(_createGetEvent(adminEmailAddress), context);

    /* Act */
    const result = await authMiddleware.isAdmin(requestHelper, responseHelper);

    /* Assert */
    expect(result).toBe(undefined);
    expect(requestHelper.getUser().emailAddress).toBe(adminEmailAddress);
    expect(requestHelper.getUser().isAdmin).toBe(true);
});
test('isAdmin rejects non-admins', async () => {
    /* Arrange */
    // noinspection JSCheckFunctionSignatures
    const requestHelper = new RequestHelper(_createGetEvent(ordinaryEmailAddress), context);

    /* Act */
    const result = await authMiddleware.isAdmin(requestHelper, responseHelper);

    /* Assert */
    expect(result).toBe(undefined);
    expect(requestHelper.getUser().emailAddress).toBe(ordinaryEmailAddress);
    expect(requestHelper.getUser().isAdmin).toBe(false);
});

/**
 * @param emailAddress
 * @returns {ApiGatewayEvent}
 * @private
 */
function _createGetEvent(emailAddress) {
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