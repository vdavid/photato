const Auth0Authorizer = require('./Auth0Authorizer.js');
const auth0Authorizer = new Auth0Authorizer('https://photato.eu.auth0.com/userinfo');

test('Can validate good token', async () => {
    /* Arrange */
    const validAccessToken = 'HqjagZDI00DeOspGcJdJ29TQNomuvj_G'; /* Sorry, it's inconvenient, but you'll need a valid access token for this test */

    /* Act */
    const validPromise = auth0Authorizer.getAuth0UserData(validAccessToken);

    /* Assert */
    expect.assertions(1);
    await expect(validPromise).resolves.toHaveProperty('email');
});

test('Can invalidate bad token', async () => {
    /* Arrange */
    const invalidAccessToken = 'invalidtoken';

    /* Act */
    const result = await auth0Authorizer.getAuth0UserData(invalidAccessToken);

    /* Assert */
    expect(result).toBeFalsy();
});