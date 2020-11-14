const PhotoRepository = require('./PhotoRepository.js');

test('Uploads image', async () => {
    /* Assemble */
    const bucketName = 'test-bucket';
    const environment = 'development';
    const testFields = {
        emailAddress: 'test@user.com',
        courseName: 'xx-1',
        weekIndex: 5,
        originalFileName: 'test.jpg',
        title: 'Some title',
        mimeType: 'image/jpeg',
    };

    const s3Mock = {
        getSignedUrl: (operation, parameters) => ({operation, bucket: parameters.Bucket, key: parameters.Key, metadata: parameters.Metadata, contentType: parameters.ContentType})
    };
    // noinspection JSCheckFunctionSignatures
    const photoRepository = new PhotoRepository(s3Mock, bucketName);

    /* Act */
    const result = await photoRepository.getSignedUrl(environment, testFields);

    /* Assert */
    expect(result.operation).toBe('putObject');
    expect(result.bucket).toBe(bucketName);
    expect(result.key).toBe('development/photos/xx-1/week-5/test@user.com.jpg');
    expect(result.metadata['email-address']).toBe(encodeURIComponent(testFields.emailAddress));
    expect(result.metadata['original-file-name']).toBe(encodeURIComponent(testFields.originalFileName));
    expect(result.metadata['title']).toBe(encodeURIComponent(testFields.title));
    expect(result.contentType).toBe(testFields.mimeType);
});

test('Throws on bad mime type', async () => {
    /* Assemble */
    const bucketName = 'test-bucket';
    const environment = 'development';
    const testFields = {
        emailAddress: 'test@user.com',
        courseName: 'xx-2',
        weekIndex: 5,
        originalFileName: 'test.txt',
        title: 'Some title',
        mimeType: 'text/plain',
    };
    const s3Mock = {
        getSignedUrl: (operation, parameters) => ({operation, bucket: parameters.Bucket, key: parameters.Key, metadata: parameters.Metadata, contentType: parameters.ContentType})
    };
    // noinspection JSCheckFunctionSignatures
    const photoRepository = new PhotoRepository(s3Mock, bucketName);

    /* Act & assert */
    expect(() => photoRepository.getSignedUrl(environment, testFields)).toThrow('Bad mime type.');
});

test('Can list photos for a week', async () => {
    /* Arrange */
    const bucketName = 'test-bucket';
    const testInput = {
        environment: 'development',
        courseName: 'xx-2',
        weekIndex: 5,
    };
    const fakeFileCount = 160;
    const s3Mock = {
        listObjectsV2: () => ({promise: async () => ({Contents: Array(fakeFileCount).fill(0).map((value, index) => ({Key: `key${index}`}))})}),
        headObject: ({Key: key}) => ({promise: async () => ({ContentType: 'image/jpeg', ContentLength: 1024, Metadata: {'email-address': `email-${key}@test.com`, title: `${key} title`}, LastModified: new Date('2011-11-11')})}),
    };
    // noinspection JSCheckFunctionSignatures
    const photoRepository = new PhotoRepository(s3Mock, bucketName);

    /* Act */
    const photoInfo = await photoRepository.listPhotosForWeek(testInput.environment, testInput.courseName, testInput.weekIndex);

    /* Assert */
    expect(photoInfo.length).toBe(160);
    expect(photoInfo[1].url).toBe(`https://${bucketName}.s3.amazonaws.com/key1`);
    expect(photoInfo[1].emailAddress).toBe('email-key1@test.com');
    expect(photoInfo[1].title).toBe('key1 title');
    expect(photoInfo[1].contentType).toBe('image/jpeg');
    expect(photoInfo[1].sizeInBytes).toBe(1024);
    expect(photoInfo[1].lastModifiedDate.toISOString()).toBe(new Date('2011-11-11').toISOString());
    expect(photoInfo[2].title).toBe('key2 title');
});