/* Requires */
const RequestHelper = require('../../http/RequestHelper.js');
const ResponseHelper = require('../../http/ResponseHelper.js');
const {eventSources} = require('../../http/eventSources.js');
const GetAllMessagesController = require('./GetAllMessagesController.js');

/* Constants */
const mockMessages = [{a: 1}, {a: 2}, {a: 3}];

// noinspection JSUnusedGlobalSymbols
const photatoMessageRepository = {getAllMessages: () => mockMessages};
// noinspection JSCheckFunctionSignatures
const getAllMessagesController = new GetAllMessagesController({photatoMessageRepository});

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
    // noinspection JSCheckFunctionSignatures
    const requestHelper = new RequestHelper(event, {});
    const responseHelper = new ResponseHelper(eventSources.APIGateway)

    /* Act */
    const response = await getAllMessagesController.handleOptionsRequest(requestHelper, responseHelper);

    /* Assert */
    expect(response.statusCode).toEqual(200);
    expect(response.statusDescription).toEqual('OK');
    expect(response.body).toEqual(undefined);
});

test('Accepts valid GET requests', async () => {
    /* Arrange */
    const adminEmailAddress = 'veszelovszki@gmail.com';
    const event = {
        path: '/get-all-messages',
        httpMethod: 'GET',
        headers: {
            Host: 'temp.cloudfront.net',
            Authorization: 'Bearer xyz',
        },
        queryStringParameters: {
            environment: 'development',
            emailAddress: adminEmailAddress,
            courseName: 'hu-3',
            weekIndex: '2',
            originalFileName: 'kuk.jpg',
            title: 'Test title',
            mimeType: 'image/jpeg',
        },
    };
    // noinspection JSCheckFunctionSignatures
    const requestHelper = new RequestHelper(event, {});
    const responseHelper = new ResponseHelper(eventSources.APIGateway)

    /* Act */
    const response = await getAllMessagesController.handleGetRequest(requestHelper, responseHelper);

    /* Assert */
    expect(response.body).toEqual(JSON.stringify(mockMessages));
    expect(response.statusCode).toEqual(200);
    expect(response.statusDescription).toEqual('OK');
});
