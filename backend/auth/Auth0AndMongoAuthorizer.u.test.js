const Auth0AndMongoAuthorizer = require('./Auth0AndMongoAuthorizer.js');

const user1EmailAddress = 'veszelovszki@gmail.com';
const user2EmailAddress = 'otheruser@gmail.com';
const user1LocalAccessToken = 'user1-local';
const user1Auth0AccessToken = 'user1-auth0';
const user2Auth0AccessToken = 'user2-auth0';

test('Accepts a valid access token and gets user from local repo', async () => {
    /* Arrange */
    const {auth0Authorizer, auth0AndMongoAuthorizer} = _createObjects();

    /* Act */
    const result = await auth0AndMongoAuthorizer.authenticateByAccessToken(user1LocalAccessToken);

    /* Assert */
    expect(result.emailAddress).toEqual(user1EmailAddress);
    expect(auth0Authorizer.getAuth0UserInfo.mock.calls.length).toBe(0);
});
test('Accepts a valid access token from Auth0 and updates existing user', async () => {
    /* Arrange */
    const {auth0Authorizer, userRepository, auth0AndMongoAuthorizer} = _createObjects();

    /* Act */
    const result = await auth0AndMongoAuthorizer.authenticateByAccessToken(user1Auth0AccessToken);

    /* Assert */
    expect(result.emailAddress).toEqual(user1EmailAddress);
    expect(auth0Authorizer.getAuth0UserInfo.mock.calls.length).toBe(1);
    expect(userRepository.getUserByEmailAddress.mock.calls.length).toBe(1);
    expect(userRepository.updateAuth0UserInfo.mock.calls.length).toBe(1);
    expect(userRepository.createUserFromAuth0User.mock.calls.length).toBe(0);
    expect(userRepository.addSessionToUser.mock.calls.length).toBe(1);
});
test('Accepts a valid access token from Auth0 and creates new user', async () => {
    /* Arrange */
    const {auth0Authorizer, userRepository, auth0AndMongoAuthorizer} = _createObjects();

    /* Act */
    const result = await auth0AndMongoAuthorizer.authenticateByAccessToken(user2Auth0AccessToken);

    /* Assert */
    expect(result.emailAddress).toEqual(user2EmailAddress);
    expect(auth0Authorizer.getAuth0UserInfo.mock.calls.length).toBe(1);
    expect(userRepository.getUserByEmailAddress.mock.calls.length).toBe(1);
    expect(userRepository.updateAuth0UserInfo.mock.calls.length).toBe(0);
    expect(userRepository.createUserFromAuth0User.mock.calls.length).toBe(1);
    expect(userRepository.addSessionToUser.mock.calls.length).toBe(1);
});
test('Rejects an invalid user', async () => {
    /* Arrange */
    const invalidAccessToken = '9876';
    const {auth0Authorizer, userRepository, auth0AndMongoAuthorizer} = _createObjects();

    /* Act */
    const result = await auth0AndMongoAuthorizer.authenticateByAccessToken(invalidAccessToken);

    /* Assert */
    expect(result).toEqual(undefined);
    expect(auth0Authorizer.getAuth0UserInfo.mock.calls.length).toBe(1);
    expect(userRepository.getUserByEmailAddress.mock.calls.length).toBe(0);
    expect(userRepository.updateAuth0UserInfo.mock.calls.length).toBe(0);
    expect(userRepository.createUserFromAuth0User.mock.calls.length).toBe(0);
    expect(userRepository.addSessionToUser.mock.calls.length).toBe(0);
});

function _createObjects() {
    const auth0Authorizer = {
        getAuth0UserInfo: jest.fn(accessToken => ((accessToken === user1Auth0AccessToken) ? {email: user1EmailAddress} : (accessToken === user2Auth0AccessToken) ? {email: user2EmailAddress} : null)),
    };
    const userRepository = {
        getUserByAccessToken: jest.fn(accessToken => (accessToken === user1LocalAccessToken) ? {emailAddress: user1EmailAddress} : undefined),
        getUserByEmailAddress: jest.fn(emailAddress => (emailAddress === user1EmailAddress) ? {emailAddress: user1EmailAddress} : undefined),
        createUserFromAuth0User: jest.fn(auth0Info => ({emailAddress: auth0Info.email})),
        updateAuth0UserInfo: jest.fn(() => {}),
        addSessionToUser: jest.fn(() => {}),
    };
    // noinspection JSCheckFunctionSignatures
    const auth0AndMongoAuthorizer = new Auth0AndMongoAuthorizer({auth0Authorizer, userRepository});

    return {auth0Authorizer, userRepository, auth0AndMongoAuthorizer};
}
