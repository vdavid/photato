const config = require('../../config.js');
const Auth0Authorizer = require('../../auth/Auth0Authorizer.js');
const PermissionHelper = require('../../auth/PermissionHelper.js');
const PhotatoMessageRepository = require('../PhotatoMessageRepository.js');

const {getRequestDataFromApiGatewayEvent, isEnvironmentValid} = require('../../http/requestHelper.js');
const {buildResponse, buildOptionsResponse} = require('../../http/responseHelper.js');

module.exports = class GetSignedUrlHandler {
    /**
     * @param {Auth0Authorizer} [auth0Authorizer] For mocking
     * @param {PermissionHelper} [permissionHelper] For mocking
     * @param {PhotatoMessageRepository} [photatoMessageRepository] For mocking
     */
    constructor({auth0Authorizer, permissionHelper, photatoMessageRepository} = {}) {
        this._auth0Authorizer = auth0Authorizer || new Auth0Authorizer(config.auth0.userInfoEndpoint);
        this._permissionHelper = permissionHelper || new PermissionHelper();
        this._photatoMessageRepository = photatoMessageRepository || new PhotatoMessageRepository();
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
            console.debug(`getAllMessages | Got ${event.httpMethod} request.`);
            try {
                /* Parse input */
                const requestData = getRequestDataFromApiGatewayEvent(event);

                /* Authorize user */
                if (requestData.method === 'OPTIONS') {
                    return buildOptionsResponse(['GET']);
                } else if (requestData.method === 'GET') {
                    return await this._handleGetRequest(requestData);
                }
            } catch (error) {
                console.info(`getAllMessages | 400 error: "${error.message}"`);
                return buildResponse(400, error.message);
            }
        } catch (error) { // Only temporary, to see if the logging works at all.
            console.error(error);
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
                const isAdmin = this._permissionHelper.isAdmin(userData.email);
                if (isAdmin) {
                    const allMessages = this._photatoMessageRepository.getAllMessages();
                    return buildResponse(200, JSON.stringify(allMessages), {contentType: 'application/json'});
                } else {
                    console.info(`getAllMessages | 403 error: Not an admin. Email: "${userData.email}".`);
                    return buildResponse(403, 'Not an admin.');
                }
            } else {
                console.info(`getAllMessages | 403 error: Invalid user with token "${requestData.accessToken}".`);
                return buildResponse(403, 'Invalid auth0 token.');
            }
        } else {
            console.info(`getAllMessages | 400 error. Invalid environment "${requestData.arguments.environment}".`);
            return buildResponse(400, 'Wrong environment.');
        }
    }
};