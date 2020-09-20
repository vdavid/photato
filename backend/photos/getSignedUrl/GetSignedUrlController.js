const url = require('url');
const RequestHelper = require('../../http/RequestHelper.js');
const ResponseHelper = require('../../http/ResponseHelper.js');

class GetSignedUrlController {
    _photoMetadataBuilder;
    /* Create an S3 object only if we'll need it */
    _photoRepository;
    _signatureRepository;

    /**
     * @param {PhotoMetadataBuilder} [photoMetadataBuilder] For mocking
     * @param {PhotoRepository} [photoRepository] For mocking
     * @param {SignatureRepository} [signatureRepository] For mocking
     */
    constructor({photoMetadataBuilder, photoRepository, signatureRepository}) {
        this._photoMetadataBuilder = photoMetadataBuilder;
        this._photoRepository = photoRepository;
        this._signatureRepository = signatureRepository;
    }

    /**
     * @param {RequestHelper} requestHelper
     * @param {ResponseHelper} responseHelper
     * @returns {Promise<ApiGatewayResponse|LambdaEdgeResponse>}
     */
    async handleOptionsRequest(requestHelper, responseHelper) {
        return responseHelper.buildOptionsResponse(['GET']);
    }

    /**
     * @param {RequestHelper} requestHelper
     * @param {ResponseHelper} responseHelper
     * @returns {Promise<ApiGatewayResponse|LambdaEdgeResponse>}
     */
    async handleGetRequest(requestHelper, responseHelper) {
        const photoMetadata = this._photoMetadataBuilder.createFromRawFields(requestHelper.getRequestData().arguments);
        if (requestHelper.getUser().emailAddress === photoMetadata.emailAddress) {
            /* Get signed URL */
            const signedUrl = await this._photoRepository.getSignedUrl(requestHelper.getRequestData().arguments.environment, photoMetadata);
            const {path} = url.parse(signedUrl);

            /* Save signature */
            await this._signatureRepository.createValidSignatureForPath(path);

            /* Return signed upload URL */
            console.debug(`getSignedUrl | Responded with URL.`);
            return responseHelper.buildResponse(200, 'https://' + requestHelper.getRequestData().host + path);
        } else {
            console.info(`getSignedUrl | 403 error: Invalid user. Email: "${requestHelper.getUser().emailAddress}", but on photo: "${photoMetadata.emailAddress}".`);
            return responseHelper.buildResponse(403, 'Mismatching email address.');
        }
    }
}

module.exports = GetSignedUrlController;