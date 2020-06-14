const config = require('../../config.js');
const Auth0Authorizer = require('../../auth/Auth0Authorizer.js');
const PermissionHelper = require('../../auth/PermissionHelper.js');
const PhotatoMessageRepository = require('../PhotatoMessageRepository.js');
const RequestHelper = require('../../http/RequestHelper.js');
const ResponseHelper = require('../../http/ResponseHelper.js');

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
            console.debug('getAllMessages | Started responding to request.');

            const requestHelper = new RequestHelper(event);
            const responseHelper = new ResponseHelper(requestHelper.eventSource);

            try {
                /* Parse input */
                const requestData = requestHelper.getRequestData();
                console.debug(`getAllMessages | Parsed request data.`, requestData);

                /* Authorize user */
                try {
                    if (requestData.method === 'OPTIONS') {
                        return responseHelper.buildOptionsResponse(['GET']);
                    } else if (requestData.method === 'GET') {
                        return await this._handleGetRequest(requestData, requestHelper, responseHelper);
                    }
                } catch (error) {
                    console.info('getAllMessages | 401 could not authenticate.', {error});
                    return responseHelper.buildResponse(401, error.message);
                }
            } catch (error) {
                console.info(`getAllMessages | 400 bad request error: "${error.message}"`, {event});
                return responseHelper.buildResponse(400, error.message);
            }
        } catch (error) { // Only temporary, to see if the logging works at all.
            console.error(error);
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
                const isAdmin = this._permissionHelper.isAdmin(userData.email);
                if (isAdmin) {
                    const allMessages = this._photatoMessageRepository.getAllMessages();
                    return responseHelper.buildResponse(200, JSON.stringify(allMessages), {contentType: 'application/json'});
                } else {
                    console.info(`getAllMessages | 403 error: Not an admin. Email: "${userData.email}".`);
                    return responseHelper.buildResponse(403, 'Not an admin.');
                }
            } else {
                console.info(`getAllMessages | 401 error: Invalid user with token "${requestData.accessToken}".`);
                return responseHelper.buildResponse(401, 'Invalid auth0 token.');
            }
        } else {
            console.info(`getAllMessages | 400 error. Invalid environment "${requestData.arguments.environment}".`);
            return responseHelper.buildResponse(400, 'Wrong environment.');
        }
    }
};