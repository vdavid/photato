const ResponseHelper = require('./ResponseHelper.js');
const {eventSources} = require('./eventSources.js');

test('Can build API Gateway style response', () => {
   /* Arrange */
    const responseHelper = new ResponseHelper(eventSources.APIGateway);
   /* Act */
    const response = responseHelper.buildResponse(200, 'Test');

   /* Assert */
    expect(response.status).toBeFalsy();
    expect(response.statusCode).toBe(200);
    expect(response.headers['Content-Type']).toBe('text/plain');
    expect(response.headers['Content-Encoding']).toBe('UTF-8');
    expect(response.body).toBe('Test');
});

test('Can build Lambda@Edge style response', () => {
    /* Arrange */
    const responseHelper = new ResponseHelper(eventSources.LambdaEdge);
    /* Act */
    const response = responseHelper.buildResponse(200, 'Test');

    /* Assert */
    expect(response.status).toBe(200);
    expect(response.statusCode).toBeFalsy();
    expect(response.statusDescription).toBe('OK');
    expect(response.headers['content-type'][0].key).toBe('Content-Type');
    expect(response.headers['content-type'][0].value).toBe('text/plain');
    expect(response.headers['content-encoding'][0].value).toBe('UTF-8');
    expect(response.body).toBe('Test');
});