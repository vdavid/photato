const SignatureRepository = require('../SignatureRepository.js');
const RequestHelper = require('../../http/RequestHelper.js');
const ResponseHelper = require('../../http/ResponseHelper.js');

class ValidateSignedUrlController {
    /**
     * @param {SignatureRepository} [signatureRepository]
     */
    constructor({signatureRepository}) {
        this._signatureRepository = signatureRepository;
    }

    /**
     * Handles Lambda@Edge inputs
     *
     * @param {RequestHelper} requestHelper
     * @param {ResponseHelper} responseHelper
     * @returns {Promise<LambdaEdgeResponse>}
     */
    async handleOptionsRequest(requestHelper, responseHelper) {
        const path = requestHelper.getRequestData().url + '?' + requestHelper.getRequestData().queryString;

        if (await this._signatureRepository.isSignatureValidForPath(path)) {
            return responseHelper.buildOptionsResponse(['PUT']);
        } else {
            console.info(`ValidateSignedUrlController | handleOptionsRequest | Invalid signature. Path: “${path}”`);
            return responseHelper.buildResponse(403, 'Invalid signature for OPTIONS.');
        }
    }

    /**
     * Handles Lambda@Edge inputs
     *
     * @param {RequestHelper} requestHelper
     * @param {ResponseHelper} responseHelper
     * @returns {Promise<LambdaEdgeResponse|Object>}
     */
    async handlePutRequest(requestHelper, responseHelper) {
        const path = requestHelper.getRequestData().url + '?' + requestHelper.getRequestData().queryString;

        if (await this._signatureRepository.isSignatureValidForPath(path)) {
            await this._signatureRepository.markSignatureExpiredForPath(path);
            return requestHelper.event.Records[0].cf.request;
        } else {
            console.info(`ValidateSignedUrlController | handlePutRequest | Invalid signature. Path: “${path}”`);
            return responseHelper.buildResponse(403, 'Invalid signature for PUT.');
        }
    }
}

module.exports = ValidateSignedUrlController;