const packageJson = require('../package.json');

class VersionController {
    /**
     * @param {RequestHelper} requestHelper
     * @param {ResponseHelper} responseHelper
     * @returns {ApiGatewayResponse|LambdaEdgeResponse}
     */
    handleGetRequest(requestHelper, responseHelper) {
        return responseHelper.buildResponse(200, `Version ${packageJson.version}`);
    }
}

module.exports = VersionController;