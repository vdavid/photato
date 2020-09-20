const AWS = require('aws-sdk');
const mongoose = require('mongoose');
const MongoConnector = require('./database/MongoConnector.js');
const {getConfig} = require('./config.js');

const RequestHelper = require('./http/RequestHelper.js');
const ResponseHelper = require('./http/ResponseHelper.js');
const Router = require('./http/Router.js');
const AuthMiddleware = require('./auth/AuthMiddleware.js');

const {getUserClass} = require('./auth/User.js');
const UserRepository = require('./auth/UserRepository.js');
const Auth0Authorizer = require('./auth/Auth0Authorizer.js');
const Auth0AndMongoAuthorizer = require('./auth/Auth0AndMongoAuthorizer.js');

const PhotoMetadataBuilder = require('./photos/PhotoMetadataBuilder.js');
const PhotoRepository = require('./photos/PhotoRepository.js');
const SignatureRepository = require('./photos/SignatureRepository.js');

const PhotatoMessageRepository = require('./messages/PhotatoMessageRepository.js');

const VersionController = require('./meta/VersionController.js');
const GetSignedUrlController = require('./photos/getSignedUrl/GetSignedUrlController.js');
const GetAllMessagesController = require('./messages/getAllMessages/GetAllMessagesController.js');

const router = new Router();

/**
 * @typedef {Object} ApiGatewayEvent
 * @property {string} path
 * @property {string} httpMethod
 * @property {Object<string, string>} headers
 * @property {Object<string, string>} queryStringParameters
 */

/**
 * @typedef {Object} LambdaEdgeRecord
 * @property {{request: Object}} cf
 */

/**
 * @typedef {Object} LambdaEdgeEvent
 * @property {LambdaEdgeRecord[]} Records
 * @property {Object} Records.cf
 * @property {Object} Records.cf.request
 */

/**
 * @typedef {Object} LambdaContext Source: https://docs.aws.amazon.com/lambda/latest/dg/nodejs-context.html
 * @property {string} functionName The name of the Lambda function.
 * @property {string} functionVersion The version of the function.
 * @property {string} invokedFunctionArn The Amazon Resource Name (ARN) that's used to invoke the function. Indicates if the invoker specified a version number or alias.
 * @property {string} memoryLimitInMB The amount of memory that's allocated for the function.
 * @property {string} awsRequestId The identifier of the invocation request.
 * @property {string} logGroupName The log group for the function.
 * @property {string} logStreamName The log stream for the function instance.
 * @property {string} identity (mobile apps) Information about the Amazon Cognito identity that authorized the request.
 * @property {string} identity.cognitoIdentityId The authenticated Amazon Cognito identity.
 * @property {string} identity.cognitoIdentityPoolId The Amazon Cognito identity pool that authorized the invocation.
 * @property {Object<string, string>} clientContext (mobile apps) Client context that's provided to Lambda by the client application.
 * @property {string} clientContext.client.installation_id
 * @property {string} clientContext.client.app_title
 * @property {string} clientContext.client.app_version_name
 * @property {string} clientContext.client.app_version_code
 * @property {string} clientContext.client.app_package_name
 * @property {string} clientContext.env.platform_version
 * @property {string} clientContext.env.platform
 * @property {string} clientContext.env.make
 * @property {string} clientContext.env.model
 * @property {string} clientContext.env.locale
 * @property {string} callbackWaitsForEmptyEventLoop Set to false to send the response right away when the callback executes, instead of waiting for the Node.js event loop to be empty. If this is false, any outstanding events continue to run during the next invocation.
 */

/**
 * @param {ApiGatewayEvent|LambdaEdgeEvent} event For formats:
 *        API Gateway: See https://docs.aws.amazon.com/lambda/latest/dg/services-apigateway.html
 *        Lambda@Edge: See https://docs.aws.amazon.com/lambda/latest/dg/lambda-edge.html
 * @param {LambdaContext} context See https://docs.aws.amazon.com/lambda/latest/dg/nodejs-context.html
 * @returns {Promise<ApiGatewayResponse|LambdaEdgeResponse>}
 */
async function main(event, context) {

    const functionName = context.functionName;
    const requestHelper = new RequestHelper(event, context);
    const responseHelper = new ResponseHelper(requestHelper.eventSource);
    const config = getConfig(requestHelper.getEnvironment());
    console.debug(`${functionName} | Got ${requestHelper.getRequestData().method} request in ${requestHelper.getEnvironment()}.`);

    const photoMetadataBuilder = new PhotoMetadataBuilder();
    const s3 = new AWS.S3({region: 'us-east-1', signatureVersion: 'v4'});
    const photoRepository = new PhotoRepository(s3, config.photos.bucket.name);
    const signatureRepository = new SignatureRepository(s3, config.photos.bucket.name);
    const getSignedUrlController = new GetSignedUrlController({photoMetadataBuilder, photoRepository, signatureRepository});

    const versionController = new VersionController();
    const photatoMessageRepository = new PhotatoMessageRepository();
    const getAllMessagesController = new GetAllMessagesController({photatoMessageRepository});

    const authMiddleware = new AuthMiddleware(await _createAuth0AuthorizerForEnvironment(requestHelper.getEnvironment()));

    try {
        return await router.resolveRoutes(event, context, [
            {functionName: 'version', method: 'GET', middlewareSequence: [authMiddleware.isAdmin, versionController.handleGetRequest]},
            {functionName: 'getSignedUrl', method: 'OPTIONS', middlewareSequence: [getSignedUrlController.handleOptionsRequest]},
            {functionName: 'getSignedUrl', method: 'GET', middlewareSequence: [authMiddleware.isUser, getSignedUrlController.handleGetRequest]},
            {functionName: 'adminGetAllMessages', method: 'OPTIONS', middlewareSequence: [getAllMessagesController.handleOptionsRequest]},
            {functionName: 'adminGetAllMessages', method: 'PUT', middlewareSequence: [authMiddleware.isAdmin, getAllMessagesController.handleGetRequest]},
        ]);
    } catch (error) {
        console.info(`${requestHelper.getRequestData().method} ${context.functionName} | 500 Server Error: Totally an uncaught error. "${error.message}"`);
        return responseHelper.buildResponse(500, error.message);
    }
}

/**
 * @param {string} environment
 * @returns {Promise<Auth0AndMongoAuthorizer>}
 * @private
 */
async function _createAuth0AuthorizerForEnvironment(environment) {
    const config = getConfig(environment);
    const mongoConnector = new MongoConnector(mongoose);
    const mongoConnection = await mongoConnector.connect(config.database.connectionString, config.database.name);
    const auth0Authorizer = new Auth0Authorizer(config.auth.auth0.userInfoEndpoint);
    const userRepository = new UserRepository({userClass: getUserClass(mongoConnection), sessionValidityLengthInDays: 3});
    return new Auth0AndMongoAuthorizer({auth0Authorizer, userRepository});
}

/**
 * @typedef {function(request: RequestHelper, response: ResponseHelper):Promise<ApiGatewayResponse|LambdaEdgeResponse|undefined>} Middleware
 */

/**
 * @typedef {Object} Route
 * @property {string} functionName E.g. "getSignedUrl"
 * @property {string} method E.g. "GET"
 * @property {Middleware[]} middlewareSequence
 */


module.exports.handler = main;