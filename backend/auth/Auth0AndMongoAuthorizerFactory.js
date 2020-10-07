const mongoose = require('mongoose');
const MongoConnector = require('../database/MongoConnector.js');
const {getConfig} = require('../config.js');

const {getUserClass} = require('./User.js');
const UserRepository = require('./UserRepository.js');
const Auth0Authorizer = require('./Auth0Authorizer.js');
const Auth0AndMongoAuthorizer = require('./Auth0AndMongoAuthorizer.js');

class Auth0AndMongoAuthorizerFactory {
    /**
     * @param {Connection?} mongoConnection
     */
    constructor({mongoConnection = undefined} = {}) {
        this._mongoConnection = mongoConnection;
    }
    /**
     * @param {string} environment
     * @returns {Promise<Auth0AndMongoAuthorizer>}
     */
    async createForEnvironment(environment) {
        const config = getConfig(environment);
        const auth0Authorizer = new Auth0Authorizer(config.auth.auth0.userInfoEndpoint);
        if (!this._mongoConnection) {
            this._mongoConnection = await this._connectToMongo(environment);
        }
        const userRepository = new UserRepository({userClass: getUserClass(this._mongoConnection), sessionValidityLengthInDays: 3, adminEmailAddresses: config.adminEmailAddresses});
        return new Auth0AndMongoAuthorizer({auth0Authorizer, userRepository});
    }

    /**
     * @returns {Promise<Connection>}
     * @private
     */
    async _connectToMongo(environment) {
        const config = getConfig(environment);
        const mongoConnector = new MongoConnector(mongoose);
        return mongoConnector.connect(config.database.connectionString, config.database.name);
    }
}

module.exports = Auth0AndMongoAuthorizerFactory;