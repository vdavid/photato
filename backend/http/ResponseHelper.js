const {eventSources} = require('./eventSources.js');
const {getStatusDescription} = require('./statusCodes.js');

class ResponseHelper {
    /**
     * @param {string} eventSource One of the event source constants
     */
    constructor(eventSource) {
        this.eventSource = eventSource;
    }

    /**
     * @param {int} statusCode
     * @param {string} body
     * @param {string} [contentType] Default is 'text/plain'.
     * @returns {Object}
     */
    buildResponse(statusCode, body, {contentType = 'text/plain'} = {}) {
        const apiGatewayResponse = this._buildApiGatewayResponse(statusCode, body, {contentType});
        return this.eventSource === eventSources.LambdaEdge ? this.convertResponseToEdge(apiGatewayResponse) : apiGatewayResponse;
    }

    /**
     * @param {int} statusCode
     * @param {string} body
     * @param {string} [contentType] Default is 'text/plain'.
     * @returns {Object}
     */
    _buildApiGatewayResponse(statusCode, body, {contentType = 'text/plain'} = {}) {
        return {
            statusCode,
            headers: {
                'Content-Type': contentType,
                'Content-Encoding': 'UTF-8',
                'Access-Control-Allow-Origin': '*',
            },
            body,
        };
    }

    /**
     * @param {string[]} allowedMethods
     * @returns {Object}
     */
    buildOptionsResponse(allowedMethods) {
        const apiGatewayResponse = this._buildApiGatewayOptionsResponse(allowedMethods);
        return this.eventSource === eventSources.LambdaEdge ? this.convertResponseToEdge(apiGatewayResponse) : apiGatewayResponse;
    }

    /**
     * @param {{statusCode: int, statusDescription: string, headers: Object<string, string>, body?: string}} apiGatewayResponse
     * @returns {{status: int, statusDescription: string, headers: Object<string, {key: string, value: string}[]>, body?: string}}
     */
    convertResponseToEdge(apiGatewayResponse) {
        return {
            status: apiGatewayResponse.statusCode,
            statusDescription: getStatusDescription(apiGatewayResponse.statusCode),
            headers: Object.entries(apiGatewayResponse.headers).reduce((result, [key, value]) => ({...result, [key.toLowerCase()]: [{key, value}]}), {}),
            ...((apiGatewayResponse.body) && {body: apiGatewayResponse.body})
        };
    }

    /**
     * @param {string[]} allowedMethods
     * @returns {Object}
     */
    _buildApiGatewayOptionsResponse(allowedMethods) {
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': allowedMethods.join(', '),
                'Access-Control-Allow-Headers': '*',
            },
        };
    }
}

module.exports = ResponseHelper;