const {httpStatusCodes, getStatusCode, getStatusDescription} = require('./statusCodes.js');

test('Finds status description by code', () => {
    /* Arrange */
    const code = httpStatusCodes.OK;

    /* Act */
    const description = getStatusDescription(code);

    /* Assert */
    expect(description).toBe('OK');
});


test('Finds status code by description', () => {
    /* Arrange */
    const description = 'OK';

    /* Act */
    const code = getStatusCode(description);

    /* Assert */
    expect(code).toBe(200);
});