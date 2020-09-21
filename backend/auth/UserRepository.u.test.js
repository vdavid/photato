const UserRepository = require('./UserRepository.js');

test('Can createUserFromAuth0User', () => {
    /* Arrange */
    const auth0UserInfo = {
        sub: '248289761001',
        name: 'Jane Josephine Doe',
        given_name: 'Jane',
        family_name: 'Doe',
        middle_name: 'Josephine',
        nickname: 'JJ',
        preferred_username: 'j.doe',
        profile: 'http://exampleco.com/janedoe',
        picture: 'http://exampleco.com/janedoe/me.jpg',
        website: 'http://exampleco.com',
        email: 'janedoe@exampleco.com',
        email_verified: true,
        gender: 'female',
        birthdate: '1972-03-31',
        zoneinfo: 'America/Los_Angeles',
        locale: 'en-US',
        phone_number: '+1 (111) 222-3434',
        phone_number_verified: false,
        address: {
            country: 'us',
        },
        updated_at: "1556845729"
    };
    const creationDateTime = new Date();
    const fakeUserClass = class FakeUser {
        constructor(object) {
            return {
                ...object,
                _id: 1,
                creationDateTime,
            };
        }
    };
    // noinspection JSCheckFunctionSignatures
    const userRepository = new UserRepository({userClass: fakeUserClass});

    /* Act */
    const user = userRepository.createUserFromAuth0User(auth0UserInfo);

    /* Assert */
    expect(user._id).toBe(1);
    expect(user.creationDateTime).toBe(creationDateTime);
    expect(user.emailAddress).toBe(auth0UserInfo.email);
    expect(user.isAdmin).toBe(false);
    expect(user.auth0UserInfo).toBe(auth0UserInfo);
});

test('Can getUserByEmailAddress', async () => {
    /* Arrange */
    const testEmailAddress = 'test@test.com';
    const fakeUser = 5;
    const fakeUserClass = {
        findOne: ({emailAddress}) => ({exec: () => (emailAddress === testEmailAddress ? fakeUser : undefined)}),
    };
    // noinspection JSCheckFunctionSignatures
    const userRepository = new UserRepository({userClass: fakeUserClass});

    /* Act */
    const result = await userRepository.getUserByEmailAddress(testEmailAddress);

    /* Assert */
    expect(result).toBe(fakeUser);
});

test('Recognizes admin users', () => {
    /* Arrange */
    // noinspection JSCheckFunctionSignatures
    // TODO Write this test. Started below
    //const adminEmailAddress = 'admin@email.com';
    //const userRepository = new UserRepository({userClass: fakeUserClass, adminEmailAddresses: [adminEmailAddress]});
    /* Act */
    /* Assert */
});

test('Can updateUserAuth0Data', () => {
    /* Arrange */
    // TODO Write this test
    /* Act */
    /* Assert */
});
test('Can deleteUser', () => {
    /* Arrange */
    // TODO Write this test
    /* Act */
    /* Assert */
});
