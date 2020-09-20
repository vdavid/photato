const {eventSources} = require('./eventSources.js');

/**
 * @typedef {Object} RequestData
 * @property {string} url
 * @property {string} method
 * @property {string} host
 * @property {string|null} queryString
 * @property {string|null} accessToken
 * @property {Object<string, string>} arguments
 */

class RequestHelper {
    /**
     * @type {ApiGatewayEvent|LambdaEdgeEvent}
     */
    event;
    /**
     * @type {LambdaContext}
     */
    context;
    /**
     * @type {string}
     */
    eventSource;
    /**
     * @type {RequestData}
     * @private
     */
    _requestData;
    /**
     * @type {User|undefined}
     * @private
     */
    _user;

    /**
     * @param {ApiGatewayEvent|LambdaEdgeEvent} event
     *        API Gateway format: https://docs.aws.amazon.com/lambda/latest/dg/services-apigateway.html
     *        Lambda@Edge format: https://docs.aws.amazon.com/lambda/latest/dg/lambda-edge.html
     * @param {LambdaContext} context See https://docs.aws.amazon.com/lambda/latest/dg/nodejs-context.html
     * @param {Object} event
     */
    constructor(event, context) {
        this.event = event;
        this.context = context;
        this.eventSource = this.determineEventSource(event);
        this._requestData = undefined;
        this._user = undefined;
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
     * @returns {RequestData}
     */
    getRequestData() {
        if (!this._requestData) {
            if (this.eventSource === eventSources.LambdaEdge) {
                this._requestData = this._getRequestDataFromLambdaEdgeEvent();
            } else {
                this._requestData = this._getRequestDataFromApiGatewayEvent();
            }
        }
        return this._requestData;
    }

    /**
     * @returns {RequestData}
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
     * @returns {RequestData}
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

    getAccessToken() {
        return this.getRequestData().accessToken;
    }

    getEnvironment() {
        return this.getRequestData().arguments.environment;
    }

    isEnvironmentValid() {
        const knownEnvironments = ['development', 'staging', 'production'];
        return knownEnvironments.includes(this.getEnvironment());
    }

    /**
     * @param {User} user
     */
    setUser(user) {
        this._user = user;
    }

    /**
     * @returns {User|undefined}
     */
    getUser() {
        return this._user;
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