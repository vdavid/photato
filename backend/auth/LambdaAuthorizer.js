const AWS = require('aws-sdk');
const lambda = new AWS.Lambda({region: 'us-east-1'});

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
                FunctionName: 'getUser',
                InvocationType: 'Event',
                LogType: 'Tail',
                Payload: JSON.stringify({accessToken, environment}),
            }).promise();
            console.log('Got payload: ' + result.Payload);
            const payloadAsString = result.Payload.toString();
            console.log('Payload as string: ' + payloadAsString);
            return payloadAsString !== 'undefined' ? JSON.parse(payloadAsString) : undefined;
        } catch (error) {
            console.error('LambdaAuthorizer | Request came back with an error.', error);
        }
    }
}

module.exports = LambdaAuthorizer;