const Auth0Authorizer = require('./Auth0Authorizer.js');
const auth0Authorizer = new Auth0Authorizer('https://photato.eu.auth0.com/userinfo');

test('Can validate good token', async () => {
    /* Arrange */
    // noinspection SpellCheckingInspection
    const validAccessToken = 'REDACTED'; /* Dead: the Auth0 tenant is gone. This test can't run; kept as a shape reference. You'd need a valid access token here. */

    /* Act */
    const userInfo = await auth0Authorizer.getAuth0UserInfo(validAccessToken);

    /* Assert */
    await expect(userInfo).toHaveProperty('email');
});

test('Can invalidate bad token', async () => {
    /* Arrange */
    // noinspection SpellCheckingInspection
    const invalidAccessToken = 'invalidtoken';

    /* Act */
    const userInfo = await auth0Authorizer.getAuth0UserInfo(invalidAccessToken);

    /* Assert */
    expect(userInfo).toBeFalsy();
});