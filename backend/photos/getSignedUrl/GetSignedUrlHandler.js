const url = require('url');
const {parseQueryString, validateEnvironment} = require('../../http/requestHelper.js');
const {buildResponse} = require('../../http/responseHelper.js');

module.exports = class GetSignedUrlHandler {
    /**
     * @param {PhotoMetadataBuilder} photoMetadataBuilder
     * @param {PhotoRepository} photoRepository
     * @param {SignatureRepository} signatureRepository
     */
    constructor({photoMetadataBuilder, photoRepository, signatureRepository}) {
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
     * @param {{email: string}} userData TODO: Add more fields and create a type of this
     * @returns {Promise<{status: number, statusDescription: string, headers: Object, body: string}>}
     */
    async handleRequest(event, context, userData) {
        try {
            /* Parse input */
            /** @type {Object} */
            const parameters = this._parseEvent(event);
            const photoMetadata = this._photoMetadataBuilder.createFromRawFields(parameters);
            const environment = validateEnvironment(parameters.environment);

            /* Authorize user */
            if (userData.email === photoMetadata.emailAddress) {

                /* Get signed URL */
                const signedUrl = await this._photoRepository.getSignedUrl(environment, photoMetadata);
                const {path} = url.parse(signedUrl);

                /* Save signature */
                await this._signatureRepository.createValidSignatureForPath(path);

                /* Return URL */
                return buildResponse(200, 'https://' + parameters.host + path);
            } else {
                return buildResponse(403, 'Invalid user.');
            }
        } catch (error) {
            return buildResponse(400, error.message);
        }
    }

    /**
     * Handles API gateway and Lambda@Edge inputs
     *
     * @param {Object} event For formats:
     *        API Gateway: See https://docs.aws.amazon.com/lambda/latest/dg/services-apigateway.html
     *        Lambda@Edge: See https://docs.aws.amazon.com/lambda/latest/dg/lambda-edge.html
     * @returns {Object} The event arguments as a JSON, plus the host in the "host" key.
     */
    _parseEvent(event) {
        if (event.body) { /* API Gateway */
            return {...JSON.parse(event.body), host: event.headers.Host};
        } else { /* Lambda@Edge */
            const request = event.Records[0].cf.request;
            return {...parseQueryString(request.querystring), host: request.headers.host[0].value};
        }
    }
};