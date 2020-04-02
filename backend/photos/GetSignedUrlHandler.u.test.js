/* Requires */
const GetSignedUrlHandler = require('./GetSignedUrlHandler.js');
const PhotoMetadataBuilder = require('./PhotoMetadataBuilder.js');
const PhotoRepository = require('./PhotoRepository.js');
const SignatureRepository = require('./SignatureRepository.js');

/* Constants */
const bucketName = 'testBucket';
const fakeQueryString = 'a=1';

/* S3 mock */
const getSignedUrlMock = jest.fn((operation, {Bucket: bucket, Key: key}) =>
    'https://' + bucket + key + '?' + fakeQueryString);
const putObjectMock = jest.fn(() => ({promise: async () => true}));
const s3 = {
    getSignedUrl: getSignedUrlMock,
    putObject: putObjectMock,
};

/* External objects */
const photoMetadataBuilder = new PhotoMetadataBuilder();
const photoRepository = new PhotoRepository(s3, bucketName);
const signatureRepository = new SignatureRepository(s3, bucketName);
const getSignedUrlHandler = new GetSignedUrlHandler({photoMetadataBuilder, photoRepository, signatureRepository});

function _convertToQueryString(object) {
    return Object.keys(object).map(key => key + '=' + object[key]).join('&');
}

test('Handles valid requests well', async () => {
    /* Arrange */
    const host = 'temp.cloudfront.net';
    const parameters = {
        emailAddress: 'test@user.com',
        courseName: 'hu-3',
        weekIndex: '2',
        originalFileName: 'kukutyin.jpg',
        title: 'Test title',
        mimeType: 'image/jpg',
    };
    const event = {
        Records: [
            {
                cf: {
                    request: {
                        headers: {host: [{key: 'Host', value: host}]},
                        method: 'GET',
                        querystring: _convertToQueryString(parameters),
                        uri: '/',
                    },
                },
            },
        ],
    };

    /*Act */
    const response = await getSignedUrlHandler.handleRequest(event, {});

    /* Assert */
    expect(response.body).toEqual('https://' + host + '/photos/' + parameters.courseName + '/'
        + 'week-' + parameters.weekIndex + '/' + parameters.emailAddress + '.jpg'
        + '?' + fakeQueryString);
    expect(response.statusCode).toEqual(200);
    expect(response.statusDescription).toEqual('OK');
    expect(response.statusDescription).toEqual('OK');
    expect(getSignedUrlMock).toBeCalledTimes(1);
    expect(getSignedUrlMock.mock.calls[0][0]).toBe('putObject');
    expect(putObjectMock).toBeCalledTimes(1);
    expect(putObjectMock.mock.calls[0][0].Bucket).toBe(bucketName);
    expect(putObjectMock.mock.calls[0][0].Key).toBe('/signatures/valid/d43fbc0c97c3b273b3d8cadf82dc73b9ba2899ef70acf396108122e1874ce024');
});
