const RequestHelper = require('../../http/RequestHelper.js');
const ResponseHelper = require('../../http/ResponseHelper.js');

class GetAllMessagesController {
    /**
     * @param {PhotatoMessageRepository} photatoMessageRepository For mocking
     */
    constructor({photatoMessageRepository}) {
        this._photatoMessageRepository = photatoMessageRepository;
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
     * @returns {Promise<ApiGatewayResponse|LambdaEdgeResponse>}
     */
    async handleGetRequest(requestHelper, responseHelper) {
        const allMessages = this._photatoMessageRepository.getAllMessages();
        console.debug(`GetAllMessagesController | handleGetRequest | Got ${allMessages.length} messages.`);
        return responseHelper.buildResponse(200, JSON.stringify(allMessages), {contentType: 'application/json'});
    }
}

module.exports = GetAllMessagesController;