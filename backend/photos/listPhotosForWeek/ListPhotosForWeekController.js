const RequestHelper = require('../../http/RequestHelper.js');
const ResponseHelper = require('../../http/ResponseHelper.js');

class ListPhotosForWeekController {
    /**
     * @param {PhotoRepository} photoRepository For mocking
     */
    constructor({photoRepository}) {
        this._photoRepository = photoRepository;
    }

    /**
     * @param {RequestHelper} requestHelper
     * @param {ResponseHelper} responseHelper
     * @returns {Promise<ApiGatewayResponse|LambdaEdgeResponse>}
     */
    async handleOptionsRequest(requestHelper, responseHelper) {
        return responseHelper.buildOptionsResponse(['GET']);
    }

    /**
     * @param {RequestHelper} requestHelper
     * @param {ResponseHelper} responseHelper
     * @returns {Promise<ApiGatewayResponse|LambdaEdgeResponse>} The returned type (stringified) is: S3PhotoMetadata[]
     */
    async handleGetRequest(requestHelper, responseHelper) {
        const photosForWeek = await this._photoRepository.listPhotosForWeek({
            environment: requestHelper.getRequestData().arguments['environment'],
            courseName: requestHelper.getRequestData().arguments['courseName'],
            weekIndex: parseInt(requestHelper.getRequestData().arguments['weekIndex']),
            getDetails: requestHelper.getRequestData().arguments['getDetails']
        });
        console.debug(`ListPhotosForWeekController | handleGetRequest | Got ${photosForWeek.length} messages.`);
        return responseHelper.buildResponse(200, JSON.stringify(photosForWeek), {contentType: 'application/json'});
    }
}

module.exports = ListPhotosForWeekController;