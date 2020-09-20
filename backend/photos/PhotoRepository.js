const uuid = require('uuid-random');

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
}

module.exports = PhotoRepository;