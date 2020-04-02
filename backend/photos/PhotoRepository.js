const uuid = require('uuid-random');

module.exports = class PhotoRepository {
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
     * @param {string} mimeType
     * @returns {string|null}
     */
    _getExtensionByMimeType(mimeType) {
        const matches = mimeType.match(/^image\/(.*)$/);
        if (matches) {
            return matches[1];
        } else {
            throw new Error('Wrong mime type: "' + mimeType + '".');
        }
    }

    /**
     * @param {PhotoMetadata} photoMetadata
     * @returns {string}
     */
    _buildPathFromMetadata(photoMetadata) {
        return '/photos/' + photoMetadata.courseName
            + '/week-' + photoMetadata.weekIndex
            + '/' + photoMetadata.emailAddress
            + '.' + this._getExtensionByMimeType(photoMetadata.mimeType);

    }

    /**
     * @param {PhotoMetadata} photoMetadata
     * @returns {string}
     */
    getSignedUrl(photoMetadata) {
        const filePath = this._buildPathFromMetadata((photoMetadata));
        const parameters = {
            Bucket: this._bucketName,
            Key: filePath,
            Metadata: {
                'uuid': uuid(),
                'email-address': photoMetadata.emailAddress,
                'original-file-name': photoMetadata.originalFileName,
                'title': photoMetadata.title
            },
            ContentType: photoMetadata.mimeType,
        };
        return this._s3.getSignedUrl('putObject', parameters);
    }
};