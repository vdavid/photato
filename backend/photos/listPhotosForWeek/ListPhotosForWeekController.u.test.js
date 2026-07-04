const RequestHelper = require('../../http/RequestHelper.js');
const ResponseHelper = require('../../http/ResponseHelper.js');
const {eventSources} = require('../../http/eventSources.js');
const ListPhotosForWeekController = require('./ListPhotosForWeekController.js');

/* Constants */
const fakePhotos = [
    {url: 'https://test-url.s3.amazonaws.com/something/test1@test.com/jpg', emailAddress: 'test1@test.com', title: 'Test photo 1', contentType: 'image/jpeg', sizeInBytes: 1024, lastModifiedDate: new Date()},
    {url: 'https://test-url.s3.amazonaws.com/something/test2@test.com/jpg', emailAddress: 'test2@test.com', title: 'Test photo 2', contentType: 'image/jpeg', sizeInBytes: 1024, lastModifiedDate: new Date()},
    {url: 'https://test-url.s3.amazonaws.com/something/test3@test.com/jpg', emailAddress: 'test3@test.com', title: 'Test photo 3', contentType: 'image/jpeg', sizeInBytes: 1024, lastModifiedDate: new Date()},
];

// noinspection JSUnusedGlobalSymbols
const photoRepository = {listPhotosForWeek: () => fakePhotos};
// noinspection JSCheckFunctionSignatures
const listPhotosForWeekController = new ListPhotosForWeekController({photoRepository});

test('Handles valid OPTIONS requests well', async () => {
    /* Arrange */
    const host = 'temp.cloudfront.net';
    const event = {
        path: '/photos/list-for-week',
        httpMethod: 'OPTIONS',
        headers: {
            Host: host,
        },
    };
    // noinspection JSCheckFunctionSignatures
    const requestHelper = new RequestHelper(event, {});
    const responseHelper = new ResponseHelper(eventSources.APIGateway)

    /* Act */
    const response = await listPhotosForWeekController.handleOptionsRequest(requestHelper, responseHelper);

    /* Assert */
    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual(undefined);
});

test('Accepts valid GET requests', async () => {
    /* Arrange */
    const emailAddress = 'test@user.com';
    const event = {
        path: '/photos/list-for-week',
        httpMethod: 'GET',
        headers: {
            Host: 'temp.cloudfront.net',
            Authorization: 'Bearer xyz',
        },
        queryStringParameters: {
            environment: 'development',
            emailAddress: emailAddress,
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
    const response = await listPhotosForWeekController.handleGetRequest(requestHelper, responseHelper);

    /* Assert */
    expect(response.body).toEqual(JSON.stringify(fakePhotos));
    expect(response.statusCode).toEqual(200);
});
