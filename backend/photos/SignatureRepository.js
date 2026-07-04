const HashProvider = require('./HashProvider.js');

class SignatureRepository {
    /**
     * @param {S3} s3
     * @param {HashProvider} [hashProvider]
     * @param {string} bucketName The name of the S3 bucket to use
     * @return {ManagedUpload}
     */
    constructor(s3, bucketName, {hashProvider} = {}) {
        this._s3 = s3;
        this._hashProvider = hashProvider || new HashProvider();
        this._bucketName = bucketName;
    }

    /**
     * @param {string} path
     * @returns {Promise}
     */
    createValidSignatureForPath(path) {
        const hash = this._hashProvider.getSHA256Hash(path);
        console.debug(`SignatureRepository | Creating signature (${hash}) for path: ${path}`);
        return this._createSignature('valid', hash);
    }

    /**
     * @param {string} path
     * @returns {Promise<boolean>}
     */
    async isSignatureValidForPath(path) {
        const hash = this._hashProvider.getSHA256Hash(path);
        console.debug(`SignatureRepository | Checking signature (${hash}) for path: ${path}`);
        return await this._doesSignatureExist('valid', hash)
            && !(await this._doesSignatureExist('expired', hash));
    }

    /**
     * @param {string} path
     * @returns {Promise}
     */
    markSignatureExpiredForPath(path) {
        const hash = this._hashProvider.getSHA256Hash(path);
        console.debug(`SignatureRepository | Marking signature (${hash}) for path: ${path}`);
        return this._createSignature('expired', hash);
    }

    /**
     * @param {'valid'|'expired'} status
     * @param {string} hash
     * @returns {Promise<boolean>}
     * @private
     */
    async _doesSignatureExist(status, hash) {
        try {
            await this._s3.headObject({Bucket: this._bucketName, Key: this._buildKey(status, hash)}).promise();
            return true;
        } catch (error) {
            console.debug(`SignatureRepository | Signature doesn’t exist with ${status}/${hash}`);
            return false;
        }
    }

    /**
     * @param {'valid'|'expired'} status
     * @param {string} hash
     * @returns {Promise}
     * @private
     */
    async _createSignature(status, hash) {
        return this._s3.putObject({
            Bucket: this._bucketName,
            Key: this._buildKey(status, hash),
            Body: JSON.stringify({created: Date.now()}),
            ContentType: 'application/json',
            ContentEncoding: 'gzip',
        }).promise();
    }

    /**
     * @param {'valid'|'expired'} status
     * @param {string} hash
     * @returns {string}
     * @private
     */
    _buildKey(status, hash) {
        return 'signatures/' + status + '/' + hash;
    }
}

module.exports = SignatureRepository;