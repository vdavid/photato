const url = require('url');
const {getRequestDataFromLambdaEdgeEvent, isEnvironmentValid} = require('../../http/requestHelper.js');
const {buildResponse, buildOptionsResponse} = require('../../http/responseHelper.js');

module.exports = class GetSignedUrlHandler {
    /**
     * @param {Auth0Authorizer} auth0Authorizer
     * @param {PhotoMetadataBuilder} photoMetadataBuilder
     * @param {PhotoRepository} photoRepository
     * @param {SignatureRepository} signatureRepository
     */
    constructor({auth0Authorizer, photoMetadataBuilder, photoRepository, signatureRepository}) {
        /** @type {Auth0Authorizer} */
        this._auth0Authorizer = auth0Authorizer;
        /** @type {PhotoMetadataBuilder} */
        this._photoMetadataBuilder = photoMetadataBuilder;
        /** @type {PhotoRepository} */
        this._photoRepository = photoRepository;
        /** @type {SignatureRepository} */
        this._signatureRepository = signatureRepository;
    }

    /**
     * @param {Object} event For formats:
     *        API Gateway: See https://docs.aws.amazon.com/lambda/latest/dg/services-apigateway.html
     *        Lambda@Edge: See https://docs.aws.amazon.com/lambda/latest/dg/lambda-edge.html
     * @param {Object} context See https://docs.aws.amazon.com/lambda/latest/dg/nodejs-context.html
     * @returns {Promise<Object>}
     */
    async handleRequest(event, context) {
        try {
            /* Parse input */
            const requestData = getRequestDataFromLambdaEdgeEvent(event);

            /* Authorize user */
            if (requestData.method === 'OPTIONS') {
                return buildOptionsResponse(['GET']);
            } else if (requestData.method === 'GET') {
                return this._handleGetRequest(requestData);
            }
        } catch (error) {
            return buildResponse(400, error.message);
        }
    }

    /**
     * @param {Object} requestData
     * @returns {Promise<Object>}
     * @private
     */
    async _handleGetRequest(requestData) {
        if (isEnvironmentValid(requestData.arguments.environment)) {
            const userData = await this._auth0Authorizer.getAuth0UserData(requestData.accessToken);
            if (userData) {
                const photoMetadata = this._photoMetadataBuilder.createFromRawFields(requestData.arguments);
                if (userData.email === photoMetadata.emailAddress) {
                    /* Get signed URL */
                    const signedUrl = await this._photoRepository.getSignedUrl(requestData.arguments.environment, photoMetadata);
                    const {path} = url.parse(signedUrl);

                    /* Save signature */
                    await this._signatureRepository.createValidSignatureForPath(path);

                    /* Return signed upload URL */
                    return buildResponse(200, 'https://' + requestData.host + path);
                } else {
                    return buildResponse(403, 'Invalid user.');
                }
            } else {
                return buildResponse(403, 'Invalid auth0 token.');
            }
        } else {
            return buildResponse(400, 'Wrong environment.');
        }
    }
};