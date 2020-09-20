const RequestHelper = require('./RequestHelper.js');
const ResponseHelper = require('./ResponseHelper.js');

class Router {
    /**
     * Finds the first matching route in the given array, and calls the specified sequence of middleware.
     * If the called sequence does not yield a result, an error will be returned.
     *
     *
     * @param {ApiGatewayEvent|LambdaEdgeEvent} event For formats:
     *        API Gateway: See https://docs.aws.amazon.com/lambda/latest/dg/services-apigateway.html
     *        Lambda@Edge: See https://docs.aws.amazon.com/lambda/latest/dg/lambda-edge.html
     * @param {LambdaContext} context See https://docs.aws.amazon.com/lambda/latest/dg/nodejs-context.html
     * @param {Route[]} routes
     * @returns {Promise<ApiGatewayResponse|LambdaEdgeResponse>}
     */
    async resolveRoutes(event, context, routes) {
        const requestHelper = new RequestHelper(event, context);
        const responseHelper = new ResponseHelper(requestHelper.eventSource);
        if (requestHelper.isEnvironmentValid()) {
            console.debug(`${context.functionName} | Got ${requestHelper.getRequestData().method} request in ${requestHelper.getEnvironment()}.`);
            const firstMatchedRoute = routes.find(route => route.functionName === context.functionName && route.method === requestHelper.getRequestData().method);
            if (firstMatchedRoute) {
                for (const middleware of firstMatchedRoute.middlewareSequence) {
                    const result = await middleware(requestHelper, responseHelper);
                    if (result) {
                        return result;
                    }
                }
                console.info(`${requestHelper.getRequestData().method} ${context.functionName} | 420 error. Method Failure after running ${firstMatchedRoute.middlewareSequence} layer(s) of middleware.`);
                return responseHelper.buildResponse(420, 'Method Failure.');
            } else {
                console.info(`${requestHelper.getRequestData().method} ${context.functionName} | 405 error. Method Not Allowed.`);
                return responseHelper.buildResponse(405, 'Method Not Allowed.');

            }
        } else {
            console.info(`${requestHelper.getRequestData().method} ${context.functionName} | 400 error. Invalid environment "${requestHelper.getEnvironment()}".`);
            return responseHelper.buildResponse(400, 'Wrong environment.');
        }
    }
}

module.exports = Router;