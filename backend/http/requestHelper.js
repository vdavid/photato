
/**
 * @param {{path: string, httpMethod: string, headers: Object<string, string>, queryStringParameters: Object<string, string>}} event
 *        Format: https://docs.aws.amazon.com/lambda/latest/dg/services-apigateway.html
 * @returns {{url: string, method: string, host: string, queryString: string|null, accessToken: string|null, arguments: Object<string, string>}}
 */
function getRequestDataFromApiGatewayEvent(event) {
    return {
        url: event.path,
        method: event.httpMethod,
        host: event.headers.Host,
        queryString: _convertToQueryString(event.queryStringParameters),
        accessToken: _extractBearerToken((event.headers || {}).Authorization),
        arguments: event.queryStringParameters
    };
}

/**
 * @param {Object} event Format: https://docs.aws.amazon.com/lambda/latest/dg/lambda-edge.html
 * @returns {{url: string, method: string, host: string, queryString: string|null, accessToken: string|null, arguments: Object<string, string>}}
 */
function getRequestDataFromLambdaEdgeEvent(event) {
    const request = event.Records[0].cf.request;
    return {
        url: request.uri,
        method: request.method,
        host: request.headers.host[0].value,
        queryString: request.querystring,
        accessToken: _extractBearerToken(((request.headers || {}).authorization || [{value: undefined}])[0].value),
        arguments: _parseQueryString(request.querystring)
    };
}

/**
 * @param {string|undefined|null} queryString If undefined, null, or empty, just returns an empty object
 * @return {Object} The JSON result
 * @private
 */
function _parseQueryString(queryString) {
    return queryString ? JSON.parse(
        '{"' + queryString.replace(/&/g, '","')
        .replace(/=/g, '":"') + '"}',
        (key, value) => (key === '') ? value : decodeURIComponent(value)) : {};
}

/**
 * @param {Object?} object
 * @returns {string}
 */
function _convertToQueryString(object) {
    return object ? Object.keys(object).map(key => key + '=' + object[key]).join('&') : '';
}

function isEnvironmentValid(environmentInput) {
    const knownEnvironments = ['development', 'staging', 'production'];
    return knownEnvironments.includes(environmentInput);
}

/**
 * @param {string} authorizationHeader
 * @returns {string|null} Null if not found
 */
function _extractBearerToken(authorizationHeader) {
    return (authorizationHeader && authorizationHeader.length > 7) ? authorizationHeader.substring(7) : null;
}


module.exports = {
    getRequestDataFromApiGatewayEvent,
    getRequestDataFromLambdaEdgeEvent,
    isEnvironmentValid,
};