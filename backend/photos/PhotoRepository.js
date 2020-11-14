const path = require('path');
const uuid = require('uuid-random');
const utils = require('../common/utils.js');

/**
 * @typedef {Object} S3PhotoMetadata
 * @property {string} key
 * @property {string} fileName
 * @property {string} url
 * @property {string} emailAddress
 * @property {string} title
 * @property {string} contentType
 * @property {int} sizeInBytes
 * @property {Date} lastModifiedDate
 */

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
     * @param {boolean} [getDetails] Default is false.
     * @returns {Promise<S3PhotoMetadata[]>}
     */
    async listPhotosForWeek({environment, courseName, weekIndex, getDetails = false}) {
        const items = await this._listFilesInFolder(`${environment}/photos/${courseName}/week-${weekIndex}`);
        if (!getDetails) {
            return items;
        } else {
            return utils.promiseAllInBatches(this._getMetadataForObject.bind(this), items.map(item => item.key), 25);
        }
    }

    /**
     * @param {string} folderPath Must have NO beginning NOR closing slash
     * @returns {Promise<S3PhotoMetadata[]>} With the title and content type missing!
     * @private
     */
    async _listFilesInFolder(folderPath) {
        /* ListObjects documentation: https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#listObjectsV2-property */
        const response = await this._s3.listObjectsV2({
            Bucket: this._bucketName,
            MaxKeys: 1000, /* This is the default and the maximum. Once there are more than 1,000 uploaded pics for a week, this method needs fixing. An example on how to fix this: https://stackoverflow.com/questions/9437581/node-js-amazon-s3-how-to-iterate-through-all-files-in-a-bucket#34912646 */
            Delimiter: '/',
            Prefix: folderPath + '/',
        }).promise();
        return response.Contents.map(object => {
            const parsedPath = path.parse(object.Key);
            return {
                key: object.Key,
                fileName: parsedPath.base,
                url: `https://${this._bucketName}.s3.amazonaws.com/${object.Key}`,
                emailAddress: parsedPath.name,
                title: undefined,
                contentType: undefined,
                sizeInBytes: object.Size,
                lastModifiedDate: object.LastModified
            };
        });
    }

    /**
     * @param {string} key
     * @returns {Promise<S3PhotoMetadata>}
     * @private
     */
    async _getMetadataForObject(key) {
        const parsedPath = path.parse(key);
        const response = await this._s3.headObject({
            Bucket: this._bucketName,
            Key: key
        }).promise();
        return {
            key,
            fileName: parsedPath.base,
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