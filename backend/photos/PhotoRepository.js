const uuid = require('uuid-random');
const utils = require('../common/utils.js');

class PhotoRepository {
    /**
     * @param {S3} s3
     * @param {string} bucketName The name of the S3 bucket to use
     * @return {ManagedUpload}
     */
    constructor(s3, bucketName) {
        this._s3 = s3;
        this._bucketName = bucketName;
    }

    /**
     * @param {string} environment "development", "staging", or "production"
     * @param {PhotoMetadata} photoMetadata
     * @returns {string}
     */
    getSignedUrl(environment, photoMetadata) {
        if (photoMetadata.mimeType !== 'image/jpeg') {
            throw new Error('Bad mime type.');
        }
        const filePath = this._buildPathFromMetadata(environment, photoMetadata);
        const parameters = {
            Bucket: this._bucketName,
            Key: filePath,
            Metadata: {
                'uuid': uuid(),
                'email-address': encodeURIComponent(photoMetadata.emailAddress),
                'original-file-name': encodeURIComponent(photoMetadata.originalFileName),
                'title': encodeURIComponent(photoMetadata.title)
            },
            ContentType: photoMetadata.mimeType,
        };
        return this._s3.getSignedUrl('putObject', parameters);
    }

    /**
     * @param {string} environment "development", "staging", or "production"
     * @param {PhotoMetadata} photoMetadata
     * @returns {string}
     */
    _buildPathFromMetadata(environment, photoMetadata) {
        return environment + '/photos/' + photoMetadata.courseName
            + '/week-' + photoMetadata.weekIndex
            + '/' + photoMetadata.emailAddress
            + '.jpg';
    }

    /**
     * @param {string} environment
     * @param {string} courseName
     * @param {int} weekIndex One-based
     * @returns {Promise<{url: string, emailAddress: string, title: string, contentType: string, sizeInBytes: int, lastModifiedDate: Date}[]>}
     */
    async listPhotosForWeek(environment, courseName, weekIndex) {
        const keys = await this._getAllFileKeysInFolder(`${environment}/photos/${courseName}/week-${weekIndex}`);
        return utils.promiseAllInBatches(this._getMetadataForObject.bind(this), keys, 25);
    }

    /**
     * @param {string} folderPath Must have NO beginning NOR closing slash
     * @returns {Promise<string[]>}
     * @private
     */
    async _getAllFileKeysInFolder(folderPath) {
        /* ListObjects documentation: https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#listObjectsV2-property */
        const response = await this._s3.listObjectsV2({
            Bucket: this._bucketName,
            MaxKeys: 1000, /* This is the default and the maximum. Once there are more than 1,000 uploaded pics for a week, this method needs fixing. An example on how to fix this: https://stackoverflow.com/questions/9437581/node-js-amazon-s3-how-to-iterate-through-all-files-in-a-bucket#34912646 */
            Delimiter: '/',
            Prefix: folderPath + '/',
        }).promise();
        return response.Contents.map(object => object.Key);
    }

    /**
     * @param {string} key
     * @returns {Promise<{url: string, emailAddress: string, title: string, contentType: string, sizeInBytes: int, lastModifiedDate: Date}>}
     * @private
     */
    async _getMetadataForObject(key) {
        const response = await this._s3.headObject({
            Bucket: this._bucketName,
            Key: key
        }).promise();
        return {
            url: `https://${this._bucketName}.s3.amazonaws.com/${key}`,
            emailAddress: decodeURIComponent(response.Metadata['email-address']),
            title: decodeURIComponent(response.Metadata['title']),
            contentType: response.ContentType,
            sizeInBytes: response.ContentLength,
            lastModifiedDate: response.LastModified,
        };
    }
}

module.exports = PhotoRepository;