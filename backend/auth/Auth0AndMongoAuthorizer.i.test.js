const mongoose = require('mongoose');
const MongoConnector = require('../database/MongoConnector.js');
const {getConfig} = require('../config.js');

const {getUserClass} = require('./User.js');
const UserRepository = require('./UserRepository.js');
const Auth0Authorizer = require('./Auth0Authorizer.js');
const Auth0AndMongoAuthorizer = require('./Auth0AndMongoAuthorizer.js');

const emailAddress = 'veszelovszki@gmail.com';
const accessToken = 'hhBw8WwF1UqeuN_7PcuBRXPjoYJataIQ'; // Needs a real access token for this email address
const environment = 'development';

test('Accepts a valid access token and gets user from local repo', async () => {
    /* Arrange */
    const config = getConfig(environment);
    const mongoConnector = new MongoConnector(mongoose);
    const mongoConnection = await mongoConnector.connect(config.database.connectionString, config.database.name);
    const auth0Authorizer = new Auth0Authorizer(config.auth.auth0.userInfoEndpoint);
    const userRepository = new UserRepository({userClass: getUserClass(mongoConnection), sessionValidityLengthInDays: 3, adminEmailAddresses: config.adminEmailAddresses});
    const auth0AndMongoAuthorizer = new Auth0AndMongoAuthorizer({auth0Authorizer, userRepository});

    /* Act */
    await userRepository.deleteUser(emailAddress);
    const user = await auth0AndMongoAuthorizer.authenticateByAccessToken(accessToken, environment);
    const userFromDatabase = await userRepository.getUserByEmailAddress(emailAddress)

    /* Assert */
    expect(user.emailAddress).toEqual(emailAddress);
    expect(user.isAdmin).toEqual(true);
    expect(userFromDatabase.isAdmin).toEqual(true);
    expect(userFromDatabase.auth0UserInfo.email).toEqual(emailAddress);
});
