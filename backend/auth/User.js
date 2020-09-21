const mongoose = require('mongoose');

/**
 * @typedef {Object} auth0UserInfoSchema Source: https://auth0.com/docs/api/authentication#user-profile
 * @property {String} sub E.g. "248289761001"
 * @property {string} name E.g. "Jane Josephine Doe"
 * @property {string} given_name E.g. "Jane"
 * @property {string} family_name E.g. "Doe"
 * @property {string} middle_name E.g. "Josephine"
 * @property {string} nickname E.g. "JJ"
 * @property {string} preferred_username E.g. "j.doe"
 * @property {string} profile E.g. "http://exampleco.com/janedoe"
 * @property {string} picture E.g. "http://exampleco.com/janedoe/me.jpg"
 * @property {string} website E.g. "http://exampleco.com"
 * @property {string} email E.g. "janedoe@exampleco.com"
 * @property {boolean} email_verified
 * @property {string} gender E.g. "female"
 * @property {string} birthdate E.g. "1972-03-31"
 * @property {string} zoneinfo E.g. "America/Los_Angeles"
 * @property {string} locale E.g. "en-US"
 * @property {string} phone_number E.g. "+1 (111) 222-3434"
 * @property {boolean} phone_number_verified
 * @property {{country: string}} address E.g. {country: "us"}
 * @property {string} updated_at Unix timestamp. E.g. "1556845729"
 */
const auth0UserInfoSchema = new mongoose.Schema({
    sub: String,
    name: String,
    given_name: String,
    family_name: String,
    middle_name: String,
    nickname: String,
    preferred_username: String,
    profile: String,
    picture: String,
    website: String,
    email: String,
    email_verified: Boolean,
    gender: String,
    birthdate: String,
    zoneinfo: String,
    locale: String,
    phone_number: String,
    phone_number_verified: Boolean,
    address: {
        country: String,
    },
    updated_at: String,
}, {minimize: false});

/**
 * @typedef {Object} sessionSchema
 * @property {Date} expirationDateTime
 * @property {string} auth0AccessToken
 */
const sessionSchema = new mongoose.Schema({
    expirationDateTime: Date,
    auth0AccessToken: String,
});

/**
 * @typedef {Object} User
 * @property {Date} creationDateTime Timestamp in seconds (seconds since Unix epoch 1970-01-01 00:00 UTC).
 *           Use moment(createdAt * 1000).format('YYYY-MM-DD HH:mm:ss') to convert it to ISO date.
 * @property {string} emailAddress
 * @property {boolean} isAdmin
 * @property {auth0UserInfoSchema} auth0UserInfo
 * @property {sessionSchema[]} sessions
 * ---------
 * @property {String} _id Mongo ID
 * @property {function():Promise<User>} save From mongoose, but added here to avoid unhelpful code warnings in IDEs
 * @property {function(string):void} markModified From mongoose, but added here to avoid unhelpful code warnings in IDEs
 */
const userSchema = new mongoose.Schema({
    creationDateTime: {type: Date, default: new Date()},
    emailAddress: String,
    isAdmin: {type: Boolean, default: false},
    auth0UserInfo: auth0UserInfoSchema,
    sessions: [sessionSchema], // TODO: Is this the right format?
}, {minimize: false});

/* Disable VersionKey */
// noinspection JSUnresolvedFunction
userSchema.set('versionKey', false);

/**
 * @param {Mongoose|Connection} connection Mongo connection or Mongoose library to use.
 *        Warning: If we'd use the one in this library then requests would silently fail because the one in this package has no connection.
 *                 It's a tricky problem. So this argument is mandatory.
 * @param {string?} name Name of the class to create. Optional.
 * @param {string?} collection Name of the collection in the DB. Optional.
 * @returns {function(new: User, properties: Object)|{findOne: function(Object): Object, deleteOne: function(Object): void}}
 */
function getUserClass(connection = undefined, name = 'user', collection = 'users') {
    // noinspection JSUnresolvedFunction
    return connection.model(name, userSchema, collection);
}

// noinspection JSUnusedGlobalSymbols
module.exports = {
    getUserClass,
};
