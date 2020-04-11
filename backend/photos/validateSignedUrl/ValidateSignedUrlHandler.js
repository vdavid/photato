const {getRequestDataFromLambdaEdgeEvent} = require('../../http/requestHelper.js');
const {buildResponse, buildOptionsResponse} = require('../../http/responseHelper.js');

module.exports = class ValidateSignedUrlHandler {
    /**
     * @param {SignatureRepository} signatureRepository
     */
    constructor({signatureRepository}) {
        /** @type {SignatureRepository} */
        this._signatureRepository = signatureRepository;
    }

    /**
     * Handles Lambda@Edge inputs
     *
     * @param {Object} event See for format: https://docs.aws.amazon.com/lambda/latest/dg/lambda-edge.html
     * @returns {Promise<Object>}
     */
    async handleRequest(event) {
        const requestData = getRequestDataFromLambdaEdgeEvent(event);
        const path = requestData.url + '?' + requestData.queryString;

        if (requestData.method === 'OPTIONS') {
            if (await this._signatureRepository.isSignatureValidForPath(path)) {
                return buildOptionsResponse(['PUT']);
            } else {
                return buildResponse(403, 'Invalid signature for OPTIONS.');
            }
        } else if (requestData.method === 'PUT') {
            if (await this._signatureRepository.isSignatureValidForPath(path)) {
                await this._signatureRepository.markSignatureExpiredForPath(path);
                return event.Records[0].cf.request;
            } else {
                return buildResponse(403, 'Invalid signature for PUT.');
            }
        } else {
            return buildResponse(400, 'Wrong method.');
        }
    }
};