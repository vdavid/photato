const AWS = require('aws-sdk');
const {getDefaultConfig} = require('./config.js');

const AuthMiddleware = require('./auth/AuthMiddleware.js');
const LambdaAuthorizer = require('./auth/LambdaAuthorizer.js');

const RequestHelper = require('./http/RequestHelper.js');
const ResponseHelper = require('./http/ResponseHelper.js');
const Router = require('./http/Router.js');

const PhotoMetadataBuilder = require('./photos/PhotoMetadataBuilder.js');
const PhotoRepository = require('./photos/PhotoRepository.js');
const SignatureRepository = require('./photos/SignatureRepository.js');
const GetSignedUrlController = require('./photos/getSignedUrl/GetSignedUrlController.js');
const ValidateSignedUrlController = require('./photos/validateSignedUrl/ValidateSignedUrlController.js');

const defaultConfig = getDefaultConfig();
const router = new Router({appName: defaultConfig.appName});
const s3 = new AWS.S3({region: 'us-east-1', signatureVersion: 'v4'});

const photoMetadataBuilder = new PhotoMetadataBuilder();
const photoRepository = new PhotoRepository(s3, defaultConfig.photos.bucket.name);
const signatureRepository = new SignatureRepository(s3, defaultConfig.photos.bucket.name);
const getSignedUrlController = new GetSignedUrlController({photoMetadataBuilder, photoRepository, signatureRepository});

const validateSignedUrlController = new ValidateSignedUrlController({signatureRepository});
const authMiddleware = new AuthMiddleware(new LambdaAuthorizer());

async function main(event, context) {
    const requestHelper = new RequestHelper(event, context);
    const responseHelper = new ResponseHelper(requestHelper.eventSource);

    try {
        return await router.resolveRoutes(event, context, [
            {functionName: 'getSignedUrl', method: 'OPTIONS', middlewareSequence: [getSignedUrlController.handleOptionsRequest]},
            {functionName: 'getSignedUrl', method: 'GET', middlewareSequence: [authMiddleware.isUser.bind(authMiddleware), getSignedUrlController.handleGetRequest.bind(getSignedUrlController)]},
            {functionName: 'validateSignedUrl', method: 'OPTIONS', middlewareSequence: [validateSignedUrlController.handleOptionsRequest.bind(validateSignedUrlController)]},
            {functionName: 'validateSignedUrl', method: 'PUT', middlewareSequence: [validateSignedUrlController.handlePutRequest.bind(validateSignedUrlController)]},
        ]);
    } catch (error) {
        console.info(`${requestHelper.getRequestData().method} ${context.functionName} | 500 Server Error: Totally an uncaught error. "${error.message}"`);
        return responseHelper.buildResponse(500, error.message);
    }
}

module.exports.handler = main;