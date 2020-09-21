const mongoose = require('mongoose');
const MongoConnector = require('../database/MongoConnector.js');
const {getConfig} = require('../config.js');

const {getUserClass} = require('./User.js');
const UserRepository = require('./UserRepository.js');
const Auth0Authorizer = require('./Auth0Authorizer.js');
const Auth0AndMongoAuthorizer = require('./Auth0AndMongoAuthorizer.js');

/**
 * @param {{environment: string, accessToken: string}} event
 * @param {LambdaContext} context See https://docs.aws.amazon.com/lambda/latest/dg/nodejs-context.html
 * @returns {Promise<string>} The user stringified, or an an empty string in case of error
 */
async function handler(event, context) {
    console.info(`Got request.`, {event, context});
    const auth0AndMongoAuthorizer = await _createAuth0AndMongoAuthorizerForEnvironment(event.environment)
    const user = auth0AndMongoAuthorizer.authenticateByAccessToken(event.accessToken);
    const returnValue = user ? JSON.stringify(user) : '';
    console.debug('Returning result.', {returnValue});
    return returnValue;
}

/**
 * @param {string} environment
 * @returns {Promise<Auth0AndMongoAuthorizer>}
 * @private
 */
async function _createAuth0AndMongoAuthorizerForEnvironment(environment) {
    const config = getConfig(environment);
    const mongoConnector = new MongoConnector(mongoose);
    const mongoConnection = await mongoConnector.connect(config.database.connectionString, config.database.name);
    const auth0Authorizer = new Auth0Authorizer(config.auth.auth0.userInfoEndpoint);
    const userRepository = new UserRepository({userClass: getUserClass(mongoConnection), sessionValidityLengthInDays: 3, adminEmailAddresses: config.adminEmailAddresses});
    return new Auth0AndMongoAuthorizer({auth0Authorizer, userRepository});
}

module.exports.handler = handler;