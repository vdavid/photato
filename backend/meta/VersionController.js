const packageJson = require('../package.json');

class VersionController {
    /**
     * @param {RequestHelper} requestHelper
     * @param {ResponseHelper} responseHelper
     */
    handleGetRequest(requestHelper, responseHelper) {
        responseHelper.buildResponse(200, `Version ${packageJson.version}`);
    }
}

module.exports = VersionController;