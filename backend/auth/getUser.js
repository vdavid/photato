const Auth0AndMongoAuthorizerFactory = require('./Auth0AndMongoAuthorizerFactory.js');

/**
 * @param {{environment: string, accessToken: string}} event
 * @param {LambdaContext} context See https://docs.aws.amazon.com/lambda/latest/dg/nodejs-context.html
 * @returns {Promise<User|string>} The user as a JSON, or an an empty string in case of an error.
 */
async function handler(event, context) {
    console.info(`getUser | Got request.`, {event, context});
    const auth0AndMongoAuthorizerFactory = new Auth0AndMongoAuthorizerFactory();
    const auth0AndMongoAuthorizer = await auth0AndMongoAuthorizerFactory.createForEnvironment(event.environment)
    const user = await auth0AndMongoAuthorizer.authenticateByAccessToken(event.accessToken, event.environment);
    console.debug('getUser | Returning result.', user);
    return user || '';
}

module.exports.handler = handler;