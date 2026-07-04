/* Requires */
const RequestHelper = require('../../http/RequestHelper.js');
const ResponseHelper = require('../../http/ResponseHelper.js');
const {eventSources} = require('../../http/eventSources.js');

const SignatureRepository = require('../SignatureRepository.js');
const ValidateSignedUrlController = require('./ValidateSignedUrlController.js');

/* Constants */
const bucketName = 'testBucket';
const host = 'temp.cloudfront.net';
const queryString = 'a=1';
const uri = 'development/photos/xx-1/week-5/test@user.com.jpg';
const defaultEvent = {
    Records: [
        {
            cf: {
                request: {
                    headers: {host: [{key: 'Host', value: host}]},
                    method: 'PUT',
                    querystring: queryString,
                    uri,
                },
            },
        },
    ],
};

/* S3 mock */
const headObjectMock = jest.fn(() => ({promise: async () => true}));
const putObjectMock = jest.fn(() => ({promise: async () => true}));
const defaultS3 = {
    headObject: headObjectMock,
    putObject: putObjectMock,
};

afterEach(() => {
    headObjectMock.mockClear();
    putObjectMock.mockClear();
});

test('Allows OPTIONS for non-expired, valid signatures', async () => {
    /* Arrange */
    const localHeadObjectMock = jest.fn(({Key}) => ({
        promise: () => new Promise((resolve, reject) => Key.startsWith('signatures/valid') ? resolve() : reject())
    }));
    const s3 = {...defaultS3, headObject: localHeadObjectMock};
    // noinspection JSCheckFunctionSignatures
    const signatureRepository = new SignatureRepository(s3, bucketName);
    const validateSignedUrlController = new ValidateSignedUrlController({signatureRepository});
    const event = {
        Records: [
            {
                cf: {
                    request: {
                        headers: {host: [{key: 'Host', value: host}]},
                        method: 'OPTIONS',
                        uri,
                    },
                },
            },
        ],
    };
    // noinspection JSCheckFunctionSignatures
    const requestHelper = new RequestHelper(event, {});
    const responseHelper = new ResponseHelper(eventSources.LambdaEdge);

    /* Act */
    const response = await validateSignedUrlController.handleOptionsRequest(requestHelper, responseHelper);

    /* Assert */
    expect(response.status).toEqual(200);
    expect(response.statusDescription).toEqual('OK');
    expect(Object.keys(response.headers).length).toBe(3);
    expect(localHeadObjectMock).toBeCalledTimes(2);
    expect(putObjectMock).toBeCalledTimes(0);
});

test('Allows non-expired, valid signatures', async () => {
    /* Arrange */
    const localHeadObjectMock = jest.fn(({Key}) => ({
        promise: () => new Promise((resolve, reject) => Key.startsWith('signatures/valid') ? resolve() : reject())
    }));
    const s3 = {...defaultS3, headObject: localHeadObjectMock};
    // noinspection JSCheckFunctionSignatures
    const signatureRepository = new SignatureRepository(s3, bucketName);
    const validateSignedUrlController = new ValidateSignedUrlController({signatureRepository});

    // noinspection JSCheckFunctionSignatures
    const requestHelper = new RequestHelper(defaultEvent, {});
    const responseHelper = new ResponseHelper(eventSources.APIGateway);

    /* Act */
    const response = await validateSignedUrlController.handlePutRequest(requestHelper, responseHelper);

    /* Assert */
    expect(putObjectMock.mock.calls[0][0].Bucket).toBe(bucketName);
    // noinspection SpellCheckingInspection
    expect(putObjectMock.mock.calls[0][0].Key).toBe('signatures/expired/760f639343dd04b36ee536867ad9663bfde630553f79653e9f6d463195e895c1');
    expect(response.method).toEqual('PUT');
    expect(response.querystring).toEqual(queryString);
    expect(response.uri).toEqual(uri);
    expect(localHeadObjectMock).toBeCalledTimes(2);
    expect(putObjectMock).toBeCalledTimes(1);
});

test('Disallows expired, valid signatures', async () => {
    /* Arrange */
    // noinspection JSCheckFunctionSignatures
    const signatureRepository = new SignatureRepository(defaultS3, bucketName);
    const validateSignedUrlController = new ValidateSignedUrlController({signatureRepository});

    // noinspection JSCheckFunctionSignatures
    const requestHelper = new RequestHelper(defaultEvent, {});
    const responseHelper = new ResponseHelper(eventSources.LambdaEdge);

    /* Act */
    const response = await validateSignedUrlController.handlePutRequest(requestHelper, responseHelper);

    /* Assert */
    expect(response.status).toEqual(403);
    expect(response.statusDescription).toEqual('Forbidden');
    expect(headObjectMock).toBeCalledTimes(2);
    expect(putObjectMock).toBeCalledTimes(0);
});
