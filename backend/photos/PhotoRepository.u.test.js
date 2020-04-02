const PhotoRepository = require('./PhotoRepository.js');

test('Uploads image', async () => {
    /* Assemble */
    const bucketName = 'test-bucket';
    const testFields = {
        emailAddress: 'test@user.com',
        courseName: 'xx-1',
        weekIndex: 5,
        originalFileName: 'test.jpg',
        title: 'Some title',
        mimeType: 'image/jpg',
    };

    const s3Mock = {getSignedUrl: (operation, parameters) => ({operation, bucket: parameters.Bucket, key: parameters.Key, metadata: parameters.Metadata, contentType: parameters.ContentType})};
    const photoRepository = new PhotoRepository(s3Mock, bucketName);

    /* Act */
    const result = await photoRepository.getSignedUrl(testFields);

    /* Assert */
    expect(result.operation).toBe('putObject');
    expect(result.bucket).toBe(bucketName);
    expect(result.key).toBe('/photos/xx-1/week-5/test@user.com.jpg');
    expect(result.metadata['email-address']).toBe(testFields.emailAddress);
    expect(result.metadata['original-file-name']).toBe(testFields.originalFileName);
    expect(result.metadata['title']).toBe(testFields.title);
    expect(result.contentType).toBe(testFields.mimeType);
});

test('Throws on bad mime type', async () => {
    /* Assemble */
    const bucketName = 'test-bucket';
    const testFields = {
        emailAddress: 'test@user.com',
        courseName: 'xx-2',
        weekIndex: 5,
        originalFileName: 'test.txt',
        title: 'Some title',
        mimeType: 'text/plain',
    };
    const s3Mock = {getSignedUrl: (operation, parameters) => ({operation, bucket: parameters.Bucket, key: parameters.Key, metadata: parameters.Metadata, contentType: parameters.ContentType})};
    const photoRepository = new PhotoRepository(s3Mock, bucketName);

    /* Act & assert */
    expect(() => photoRepository.getSignedUrl(testFields)).toThrow();
});