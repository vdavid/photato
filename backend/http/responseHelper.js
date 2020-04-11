const {getStatusDescription} = require('./statusCodes.js');

/**
 * @param {int} statusCode
 * @param {string} body
 * @returns {object}
 * @private
 */
function buildResponse(statusCode, body) {
    return {
        status: statusCode,
        statusDescription: getStatusDescription(statusCode),
        headers: {
            'content-type': [{key: 'Content-Type', value: 'text/plain'}],
            'content-encoding': [{key: 'Content-Encoding', value: 'UTF-8'}],
            'access-control-allow-origin': [{key: 'Access-Control-Allow-Origin', value: '*'}],
        },
        body,
    };
}

module.exports = {
    buildResponse,
}