const {eventSources} = require('./eventSources.js');

class RequestHelper {
    /**
     * @param {{path: string, httpMethod: string, headers: Object<string, string>, queryStringParameters: Object<string, string>}|{Records: {cf: {request: Object}}[]}} event
     *        API Gateway format: https://docs.aws.amazon.com/lambda/latest/dg/services-apigateway.html
     *        Lambda@Edge format: https://docs.aws.amazon.com/lambda/latest/dg/lambda-edge.html
     * @param {Object} event
     */
    constructor(event) {
        this.event = event;
        this.eventSource = this.determineEventSource(event);
    }

    /**
     * @param {Object} event
     * @returns {string} One of the eventSources constants
     */
    determineEventSource(event) {
        if (event.Records && event.Records[0] && event.Records[0].cf) {
            return eventSources.LambdaEdge;
        } else {
            return eventSources.APIGateway;
        }
    }

    /**
     * Determines event source and parses the event data accordingly
     * @returns {{url: string, method: string, host: string, queryString: (string|null), accessToken: (string|null), arguments: Object<string, string>}}
     */
    getRequestData() {
        if (this.eventSource === eventSources.LambdaEdge) {
            return this._getRequestDataFromLambdaEdgeEvent();
        } else {
            return this._getRequestDataFromApiGatewayEvent();
        }
    }

    /**
     * @returns {{url: string, method: string, host: string, queryString: string|null, accessToken: string|null, arguments: Object<string, string>}}
     */
    _getRequestDataFromApiGatewayEvent() {
        return {
            url: this.event.path,
            method: this.event.httpMethod,
            host: this.event.headers.Host,
            queryString: this._convertToQueryString(this.event.queryStringParameters),
            accessToken: this._extractBearerToken((this.event.headers || {}).Authorization),
            arguments: this.event.queryStringParameters
        };
    }

    /**
     * @returns {{url: string, method: string, host: string, queryString: string|null, accessToken: string|null, arguments: Object<string, string>}}
     */
    _getRequestDataFromLambdaEdgeEvent() {
        const request = this.event.Records[0].cf.request;
        return {
            url: request.uri,
            method: request.method,
            host: request.headers.host[0].value,
            queryString: request.querystring,
            accessToken: this._extractBearerToken(((request.headers || {}).authorization || [{value: undefined}])[0].value),
            arguments: this._parseQueryString(request.querystring)
        };
    }

    /**
     * @param {string|undefined|null} queryString If undefined, null, or empty, just returns an empty object
     * @return {Object} The JSON result
     * @private
     */
    _parseQueryString(queryString) {
        return queryString ? JSON.parse(
            '{"' + queryString.replace(/&/g, '","')
            .replace(/=/g, '":"') + '"}',
            (key, value) => (key === '') ? value : decodeURIComponent(value)) : {};
    }

    /**
     * @param {Object?} object
     * @returns {string}
     */
    _convertToQueryString(object) {
        return object ? Object.keys(object).map(key => key + '=' + object[key]).join('&') : '';
    }

    isEnvironmentValid(environmentInput) {
        const knownEnvironments = ['development', 'staging', 'production'];
        return knownEnvironments.includes(environmentInput);
    }

    /**
     * @param {string} authorizationHeader
     * @returns {string|null} Null if not found
     */
    _extractBearerToken(authorizationHeader) {
        return (authorizationHeader && authorizationHeader.length > 7) ? authorizationHeader.substring(7) : null;
    }

}

module.exports = RequestHelper;