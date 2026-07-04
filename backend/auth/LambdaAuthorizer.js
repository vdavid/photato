const AWS = require('aws-sdk');
const lambda = new AWS.Lambda({region: 'us-east-1'});
const {getDefaultConfig} = require('../config.js');

class LambdaAuthorizer {
    /**
     * @param {string} accessToken
     * @param {string} environment E.g. "production"
     * @returns {Promise<User|undefined>}
     */
    async authenticateByAccessToken(accessToken, environment) {
        /* Docs are here: https://docs.aws.amazon.com/lambda/latest/dg/API_Invoke.html */
        try {
            const result = await lambda.invoke({
                FunctionName: `${getDefaultConfig().appName}-${environment}-getUser`,
                InvocationType: 'RequestResponse',
                LogType: 'None',
                Payload: JSON.stringify({accessToken, environment}),
            }).promise();
            const payloadAsString = result.Payload.toString();
            if (payloadAsString) {
                const user = JSON.parse(payloadAsString);
                console.debug('LambdaAuthorizer | Got user', user);
                return user;
            } else {
                console.debug('LambdaAuthorizer | Got no user.', {result});
                return undefined;
            }
        } catch (error) {
            console.error('LambdaAuthorizer | Request came back with an error.', error);
        }
    }
}

module.exports = LambdaAuthorizer;