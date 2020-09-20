const {eventSources} = require('./eventSources.js');
const {getStatusDescription} = require('./statusCodes.js');

/**
 * @typedef {Object} ApiGatewayResponse
 * @property {int} statusCode
 * @property {Object<string, string>} headers
 * @property {string|undefined} body
 */

/**
 * @typedef {Object} LambdaEdgeResponse
 * @property {int} status
 * @property {string} statusDescription
 * @property {Object<string, {key: string, value: string}[]>} headers
 * @property {string|undefined} body
 */

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
     * @returns {ApiGatewayResponse|LambdaEdgeResponse}
     */
    buildResponse(statusCode, body, {contentType = 'text/plain'} = {}) {
        const apiGatewayResponse = this._buildApiGatewayResponse(statusCode, body, {contentType});
        return this.eventSource === eventSources.LambdaEdge ? this.convertResponseToEdge(apiGatewayResponse) : apiGatewayResponse;
    }

    /**
     * @param {int} statusCode
     * @param {string?} body
     * @param {string} [contentType] Default is 'text/plain'.
     * @returns {ApiGatewayResponse}
     */
    _buildApiGatewayResponse(statusCode, body, {contentType = 'text/plain'} = {}) {
        return {
            statusCode,
            statusDescription: getStatusDescription(statusCode),
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
     * @returns {ApiGatewayResponse|LambdaEdgeResponse}
     */
    buildOptionsResponse(allowedMethods) {
        const apiGatewayResponse = this._buildApiGatewayOptionsResponse(allowedMethods);
        return this.eventSource === eventSources.LambdaEdge ? this.convertResponseToEdge(apiGatewayResponse) : apiGatewayResponse;
    }

    /**
     * @param {ApiGatewayResponse} apiGatewayResponse
     * @returns {LambdaEdgeResponse}
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
     * @returns {ApiGatewayResponse}
     */
    _buildApiGatewayOptionsResponse(allowedMethods) {
        return {
            statusCode: 200,
            statusDescription: getStatusDescription(200),
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': allowedMethods.join(', '),
                'Access-Control-Allow-Headers': '*',
            },
        };
    }
}

module.exports = ResponseHelper;