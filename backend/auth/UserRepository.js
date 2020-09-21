class UserRepository {
    /**
     * @param {Number?} sessionValidityLengthInDays Optional, default is 3.
     * @param {function(new: User, properties: Object)|{findOne: function(Object): Object, deleteOne: function(Object): void}} userClass
     * @param {string[]?} adminEmailAddresses Optional, default is [].
     */
    constructor({userClass, sessionValidityLengthInDays = 3, adminEmailAddresses = []}) {
        this.User = userClass;
        this._sessionValidityLengthInDays = sessionValidityLengthInDays;
        this._adminEmailAddresses = adminEmailAddresses;
    }

    /**
     * @param {string} emailAddress
     * @returns {Promise<User|undefined>}
     */
    async getUserByEmailAddress(emailAddress) {
        try {
            return await this.User.findOne({emailAddress}).exec();
        } catch (error) {
            console.debug('User | getUserByEmailAddress | Could not retrieve user by email.', {emailAddress, error});
            return undefined;
        }
    }

    /**
     * @param accessToken
     * @returns {Promise<User|undefined>}
     */
    async getUserByAccessToken(accessToken) {
        try {
            return await this.User.findOne({['sessions.auth0AccessToken']: accessToken}).exec();
        } catch (error) {
            console.debug('User | getUserByAccessToken | Could not retrieve user by access token.', {accessToken, error});
            return undefined;
        }
    }

    /**
     * @param {auth0UserInfoSchema} auth0UserInfo
     * @returns {User}
     */
    createUserFromAuth0User(auth0UserInfo) {
        return new this.User({
            emailAddress: auth0UserInfo.email,
            isAdmin: this._adminEmailAddresses.includes(auth0UserInfo.email),
            auth0UserInfo: auth0UserInfo,
        });
    }

    /**
     * Also deletes any expired sessions.
     *
     * @param {User} user
     * @param {string} auth0AccessToken
     * @returns {Promise<void>}
     */
    async addSessionToUser(user, auth0AccessToken) {
        this._cleanUpExpiredSessions(user);
        user.sessions.push({
            expirationDateTime: this._addDaysToDate(new Date(), this._sessionValidityLengthInDays),
            auth0AccessToken,
        });
        user.markModified('sessions');
        await user.save();
    }

    _cleanUpExpiredSessions(user) {
        const now = new Date();
        user.sessions.filter(session => session.expirationDateTime < now);
    }

    /**
     * @param {Date} date
     * @param {Number} days Can be float, or even negative
     * @returns {Date} A new date
     * @private
     */
    _addDaysToDate(date, days) {
        const result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
    }
    /**
     * Updates the "auth0UserInfo" field of the user with the given object
     *
     * @param {User} user
     * @param {auth0UserInfoSchema} auth0UserInfo
     * @returns {Promise<void>}
     */
    async updateAuth0UserInfo(user, auth0UserInfo) {
        if (user.emailAddress === auth0UserInfo.email) {
            user.auth0UserInfo = auth0UserInfo;
            await user.save();
        } else {
            console.error('User | updateUserAuth0Data | Can’t update, email address is different.', {old: user.emailAddress, new: auth0UserInfo.email});
        }
    }

    /**
     * @param {string} emailAddress
     * @returns {*} TODO: What in case of deletion? In case not found?
     */
    deleteUser(emailAddress) {
        return this.User.deleteOne({emailAddress});
    }
}

module.exports = UserRepository;