const AWS = require('aws-sdk');
const config = require('../../config.js');
const ValidateSignedUrlHandler = require('./ValidateSignedUrlHandler.js');
const SignatureRepository = require('../SignatureRepository.js');

/**
 * Handles Lambda@Edge inputs
 *
 * @param {Object} event See for format: https://docs.aws.amazon.com/lambda/latest/dg/lambda-edge.html
 * @returns {Object}
 */
async function handler(event) {
    const s3 = new AWS.S3({ region: 'us-east-1', signatureVersion: 'v4' });
    const signatureRepository = new SignatureRepository(s3, config.bucket.name);
    const handler = new ValidateSignedUrlHandler({signatureRepository});
    return handler.handleRequest(event);
}

module.exports = {
    handler,
};