const AWS = require('aws-sdk');
const config = require('../../config.js');
const GetSignedUrlHandler = require('./GetSignedUrlHandler.js');
const Auth0Authorizer = require('../../auth/Auth0Authorizer.js');
const PhotoMetadataBuilder = require('../PhotoMetadataBuilder.js');
const PhotoRepository = require('../PhotoRepository.js');
const SignatureRepository = require('../SignatureRepository.js');
const {buildResponse} = require('../../http/responseHelper.js');

module.exports.handler = async (event, context) => {
    const auth0Authorizer = new Auth0Authorizer(config.auth0.userInfoEndpoint);
    const photoMetadataBuilder = new PhotoMetadataBuilder();
    const s3 = new AWS.S3({region: 'us-east-1', signatureVersion: 'v4'});
    const photoRepository = new PhotoRepository(s3, config.bucket.name);
    const signatureRepository = new SignatureRepository(s3, config.bucket.name);

    const userData = await auth0Authorizer.getAuth0UserData(auth0Authorizer.extractBearerToken(event));
    if (userData) {
        const handler = new GetSignedUrlHandler({photoMetadataBuilder, photoRepository, signatureRepository});
        return handler.handleRequest(event, context, userData);
    } else {
        return buildResponse(403, 'Invalid auth0 token.');
    }
};