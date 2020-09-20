const SignatureRepository = require('./SignatureRepository.js');

class S3Mock {
    constructor() {
        this._db = {};
    }

    putObject({Key, Body}) {
        return {
            promise: async () => {this._db[Key] = Body;}
        };
    }
}

test('Can create and validate signatures', async () => {
    /* Assemble */
    const s3Mock = new S3Mock();
    // noinspection JSCheckFunctionSignatures
    const signatureRepository = new SignatureRepository(s3Mock, 'test-bucket');
    const testPath = 'test-path';

    /* Act */
    await signatureRepository.createValidSignatureForPath(testPath);

    /* Assert */
    expect(await signatureRepository.isSignatureValidForPath(testPath)).toBe(true);
    expect(await signatureRepository.isSignatureValidForPath('invalid-path')).toBe(false);
});

test('Can expire signatures', async () => {
    /* Assemble */
    const s3Mock = new S3Mock();
    // noinspection JSCheckFunctionSignatures
    const signatureRepository = new SignatureRepository(s3Mock, 'test-bucket');
    const testPath1 = 'test-path1';
    const testPath2 = 'test-path2';

    /* Act */
    await signatureRepository.createValidSignatureForPath(testPath1);
    await signatureRepository.createValidSignatureForPath(testPath2);
    await signatureRepository.markSignatureExpiredForPath(testPath1);

    /* Assert */
    expect(await signatureRepository.isSignatureValidForPath(testPath1)).toBe(false);
    expect(await signatureRepository.isSignatureValidForPath(testPath2)).toBe(true);
});
