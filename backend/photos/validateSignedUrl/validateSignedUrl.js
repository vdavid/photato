const ValidateSignedUrlHandler = require('./ValidateSignedUrlHandler.js');

/**
 * Handles Lambda@Edge inputs
 *
 * @param {Object} event See for format: https://docs.aws.amazon.com/lambda/latest/dg/lambda-edge.html
 * @returns {Object}
 */
async function handler(event) {
    const handler = new ValidateSignedUrlHandler();
    return handler.handleRequest(event);
}

module.exports = {
    handler,
};