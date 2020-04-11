/**
 * @param {Object} event Format: https://docs.aws.amazon.com/lambda/latest/dg/lambda-edge.html
 * @returns {{method: (string), host: (string|string), arguments: any, queryString: string | string}}
 * @returns {{url: string, method: string, host: string, queryString: string|null, accessToken: string|null, arguments: Object<string, string>}}
 */
function getRequestDataFromLambdaEdgeEvent(event) {
    const request = event.Records[0].cf.request;
    return {
        url: request.uri,
        method: request.method,
        host: request.headers.host[0].value,
        queryString: request.querystring,
        accessToken: _extractBearerToken(request),
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

function validateEnvironment(environmentInput) {
    const knownEnvironments = ['development', 'staging', 'production'];
    if (knownEnvironments.includes(environmentInput)) {
        return environmentInput;
    } else {
        throw new Error('Invalid environment.');
    }
}

/**
 * @param {Object} request Must have a header called "Authorization" with a value like "Bearer {token}"
 * @returns {string|null} Null if not found
 */
function _extractBearerToken(request) {
    const authorizationHeader = ((request.headers || {}).authorization || [{value: undefined}])[0].value;
    return (authorizationHeader && authorizationHeader.length > 7) ? authorizationHeader.substring(7) : null;
}


module.exports = {
    getRequestDataFromLambdaEdgeEvent,
    validateEnvironment,
};