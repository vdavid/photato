const AWS = require('aws-sdk');
const config = require('../../config.js');
const Auth0Authorizer = require('../../auth/Auth0Authorizer.js');
const PhotoMetadataBuilder = require('../PhotoMetadataBuilder.js');
const PhotoRepository = require('../PhotoRepository.js');
const SignatureRepository = require('../SignatureRepository.js');

const url = require('url');
const RequestHelper = require('../../http/RequestHelper.js');
const ResponseHelper = require('../../http/ResponseHelper.js');

module.exports = class GetSignedUrlHandler {
    /**
     * @param {Auth0Authorizer} [auth0Authorizer] For mocking
     * @param {PhotoMetadataBuilder} [photoMetadataBuilder] For mocking
     * @param {PhotoRepository} [photoRepository] For mocking
     * @param {SignatureRepository} [signatureRepository] For mocking
     */
    constructor({auth0Authorizer, photoMetadataBuilder, photoRepository, signatureRepository} = {}) {
        this._auth0Authorizer = auth0Authorizer || new Auth0Authorizer(config.auth0.userInfoEndpoint);
        this._photoMetadataBuilder = photoMetadataBuilder || new PhotoMetadataBuilder();
        /* Create an S3 object only if we'll need it */
        const s3 = (!photoRepository || !signatureRepository) ? new AWS.S3({ region: 'us-east-1', signatureVersion: 'v4' }) : null;
        this._photoRepository = photoRepository || new PhotoRepository(s3, config.bucket.name);
        this._signatureRepository = signatureRepository || new SignatureRepository(s3, config.bucket.name);
    }

    /**
     * @param {Object} event For formats:
     *        API Gateway: See https://docs.aws.amazon.com/lambda/latest/dg/services-apigateway.html
     *        Lambda@Edge: See https://docs.aws.amazon.com/lambda/latest/dg/lambda-edge.html
     * @param {Object} context See https://docs.aws.amazon.com/lambda/latest/dg/nodejs-context.html
     * @returns {Promise<Object>}
     */
    async handleRequest(event, context) {
        console.debug(`getSignedUrl | Got ${event.Records[0].cf.request.method} request.`)
        const requestHelper = new RequestHelper(event);
        const responseHelper = new ResponseHelper(requestHelper.eventSource);
        try {
            /* Parse input */
            const requestData = requestHelper.getRequestData();

            /* Authorize user */
            if (requestData.method === 'OPTIONS') {
                return responseHelper.buildOptionsResponse(['GET']);
            } else if (requestData.method === 'GET') {
                return this._handleGetRequest(requestData, requestHelper, responseHelper);
            }
        } catch (error) {
            console.info(`getSignedUrl | 400 error: "${error.message}"`)
            return responseHelper.buildResponse(400, error.message);
        }
    }

    /**
     * @param {Object} requestData
     * @param {RequestHelper} requestHelper
     * @param {ResponseHelper} responseHelper
     * @returns {Promise<Object>}
     * @private
     */
    async _handleGetRequest(requestData, requestHelper, responseHelper) {
        if (requestHelper.isEnvironmentValid(requestData.arguments.environment)) {
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
                    console.debug(`getSignedUrl | Responded with URL.`)
                    return responseHelper.buildResponse(200, 'https://' + requestData.host + path);
                } else {
                    console.info(`getSignedUrl | 403 error: Invalid user. Email: "${userData.email}", but on photo: "${photoMetadata.emailAddress}".`)
                    return responseHelper.buildResponse(403, 'Invalid user.');
                }
            } else {
                console.info(`getSignedUrl | 403 error: Invalid user with token "${requestData.accessToken}".`)
                return responseHelper.buildResponse(403, 'Invalid auth0 token.');
            }
        } else {
            console.info(`getSignedUrl | 400 error. Invalid environment "${requestData.arguments.environment}".`)
            return responseHelper.buildResponse(400, 'Wrong environment.');
        }
    }
};