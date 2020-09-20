const mongoose = require('mongoose');
const User = require('./User.js').getUserClass(mongoose);

test('Can hold properties', () => {
    /* Arrange */
    const creationDateTime = new Date();
    const emailAddress = 'test@test.com';
    const isAdmin = false;
    const auth0UserInfo = {given_name: 'Joe'};
    const sessions = [{expirationDateTime: new Date(), auth0AccessToken: 'xyz'}];

    /* Act */
    const user = new User({
        creationDateTime,
        emailAddress,
        isAdmin,
        auth0UserInfo,
        sessions,
    });

    /* Assert */
    expect(user.creationDateTime).toBe(creationDateTime);
    expect(user.emailAddress).toBe(emailAddress);
    expect(user.isAdmin).toBe(isAdmin);
    expect(user.auth0UserInfo.given_name).toBe(auth0UserInfo.given_name);
    expect(user.sessions.length).toBe(1);
    expect(user.sessions[0].expirationDateTime).toBe(sessions[0].expirationDateTime);
    expect(user.sessions[0].auth0AccessToken).toBe(sessions[0].auth0AccessToken);
    // noinspection JSUnresolvedVariable
    expect(user.nonExistentKey).toBe(undefined);
});