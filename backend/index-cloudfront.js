const AWS = require('aws-sdk');
const {getConfig} = require('./config.js');

const RequestHelper = require('./http/RequestHelper.js');
const ResponseHelper = require('./http/ResponseHelper.js');
const Router = require('./http/Router.js');

const SignatureRepository = require('./photos/SignatureRepository.js');
const ValidateSignedUrlController = require('./photos/validateSignedUrl/ValidateSignedUrlController.js');

const router = new Router();
const s3 = new AWS.S3({region: 'us-east-1', signatureVersion: 'v4'});

async function main(event, context) {
    const requestHelper = new RequestHelper(event, context);
    const responseHelper = new ResponseHelper(requestHelper.eventSource);

    const config = getConfig(requestHelper.getEnvironment());
    const signatureRepository = new SignatureRepository(s3, config.photos.bucket.name);
    const validateSignedUrlController = new ValidateSignedUrlController({signatureRepository});

    try {
        return await router.resolveRoutes(event, context, [
            {functionName: 'validateSignedUrl', method: 'OPTIONS', middlewareSequence: [validateSignedUrlController.handleOptionsRequest]},
            {functionName: 'validateSignedUrl', method: 'PUT', middlewareSequence: [validateSignedUrlController.handlePutRequest]},
        ]);
    } catch (error) {
        console.info(`${requestHelper.getRequestData().method} ${context.functionName} | 500 Server Error: Totally an uncaught error. "${error.message}"`);
        return responseHelper.buildResponse(500, error.message);
    }
}

module.exports.handler = main;