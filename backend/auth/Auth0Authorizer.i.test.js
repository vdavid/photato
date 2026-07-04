const Auth0Authorizer = require('./Auth0Authorizer.js');
const auth0Authorizer = new Auth0Authorizer('https://photato.eu.auth0.com/userinfo');

test('Can validate good token', async () => {
    /* Arrange */
    // noinspection SpellCheckingInspection
    const validAccessToken = 'o-lFFr8Erisc2C-Hf-BD8xKLMh9zO7zL'; /* Sorry, it's inconvenient, but you'll need a valid access token for this test */

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