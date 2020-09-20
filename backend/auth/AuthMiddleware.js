const RequestHelper = require('../http/RequestHelper.js');
const ResponseHelper = require('../http/ResponseHelper.js');

const Auth0AndMongoAuthorizer = require('./Auth0AndMongoAuthorizer.js');

class AuthMiddleware {
    /**
     * @param {Auth0AndMongoAuthorizer} auth0AndMongoAuthorizer
     */
    constructor(auth0AndMongoAuthorizer) {
        this._auth0AndMongoAuthorizer = auth0AndMongoAuthorizer;

    }

    /**
     * @param {RequestHelper} requestHelper
     * @param {ResponseHelper} responseHelper
     * @returns {Promise<ApiGatewayResponse|LambdaEdgeResponse|undefined>}
     */
    async isAdmin(requestHelper, responseHelper) {
        const authResult = this.isUser(requestHelper, responseHelper);

        if (!authResult) { /* Means we have a user */
            if (requestHelper.getUser().isAdmin) {
                return undefined; /* We're good to go with the next action */
            } else {
                console.info(`getAllMessages | 403 error: Not an admin. Email: "${requestHelper.getUser().emailAddress}".`);
                return responseHelper.buildResponse(403, 'Not an admin.');
            }
        } else { /* Means we couldn't authenticate */
            return authResult;
        }
    }

    /**
     * Note: This method has a side-effect: it sets the user in the request.
     *
     * @param {RequestHelper} requestHelper
     * @param {ResponseHelper} responseHelper
     * @returns {Promise<ApiGatewayResponse|LambdaEdgeResponse|undefined>} Undefined if it checks out
     */
    async isUser(requestHelper, responseHelper) {
        const user = await this._auth0AndMongoAuthorizer.authenticateByAccessToken(requestHelper.getAccessToken());

        if (user) {
            requestHelper.setUser(user);
            return undefined; /* We're good to go with the next action */
        } else {
            console.info(`${requestHelper.context.functionName} | 401 error: Invalid user with token "${requestHelper.getAccessToken()}".`);
            return responseHelper.buildResponse(401, 'Invalid auth0 token.');
        }
    }
}

module.exports = AuthMiddleware;