const url = require('url');

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
     * @param {string} queryString
     * @return {Object} The JSON result
     * @private
     */
    _parseQueryString(queryString) {
        return JSON.parse(
            '{"'+ queryString.replace(/&/g, '","')
            .replace(/=/g,'":"') + '"}',
            (key, value) => (key === '') ? value : decodeURIComponent(value))
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
            return {...this._parseQueryString(request.querystring), host: request.headers.host[0].value};
        }
    }
    /**
     * @param {Object} event For formats:
     *        API Gateway: See https://docs.aws.amazon.com/lambda/latest/dg/services-apigateway.html
     *        Lambda@Edge: See https://docs.aws.amazon.com/lambda/latest/dg/lambda-edge.html
     * @param {Object} context See https://docs.aws.amazon.com/lambda/latest/dg/nodejs-context.html
     * @returns {Promise<{statusCode: number, statusDescription: string, headers: Object, body: string}>}
     */
    async handleRequest(event, context) {
        try {
            /* Parse input */
            /** @type {Object} */
            const parameters = this._parseEvent(event);
            const photoMetadata = this._photoMetadataBuilder.createFromRawFields(parameters);

            /* Get signed URL */
            const signedUrl = await this._photoRepository.getSignedUrl(photoMetadata);
            const { path } = url.parse(signedUrl);

            /* Save signature */
            await this._signatureRepository.createValidSignatureForPath(path);

            /* Return URL */
            return {
                statusCode: 200,
                statusDescription: 'OK',
                headers: {
                    'content-type': [{key: 'Content-Type', value: 'text/plain'}],
                    'content-encoding': [{key: 'Content-Encoding', value: 'UTF-8'}],
                },
                body: 'https://' + parameters.host + path,
            };
        } catch(error) {
            return {
                statusCode: 400,
                statusDescription: 'Bad Request',
                headers: {
                    'content-type': [{key: 'Content-Type', value: 'text/plain'}],
                    'content-encoding': [{key: 'Content-Encoding', value: 'UTF-8'}],
                },
                body: error.message,
            }
        }
    }
};