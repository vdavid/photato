class Auth0AndMongoAuthorizer {
    /**
     * @type {Auth0Authorizer}
     * @private
     */
    _auth0Authorizer;
    /**
     * @type {UserRepository}
     * @private
     */
    _userRepository;

    /**
     * @param {Auth0Authorizer} auth0Authorizer
     * @param {UserRepository} userRepository
     */
    constructor({auth0Authorizer, userRepository}) {
        this._auth0Authorizer = auth0Authorizer;
        this._userRepository = userRepository;
    }

    /**
     * @param {string} accessToken
     * @returns {Promise<User|undefined>}
     */
    async authenticateByAccessToken(accessToken) {
        const user = await this._userRepository.getUserByAccessToken(accessToken);
        if (user) { /* We have a valid session with this access token locally */
            return user;
        } else { /* We don't know this session */
            const userInfo = await this._auth0Authorizer.getAuth0UserInfo(accessToken);
            if (userInfo) { /* Auth0 knows the token */
                const user = await this._userRepository.getUserByEmailAddress(userInfo.email);
                if (user) { /* We already had the user */
                    await this._userRepository.updateAuth0UserInfo(user, userInfo);
                    await this._userRepository.addSessionToUser(user, accessToken);
                    return user;
                } else {
                    const user = this._userRepository.createUserFromAuth0User(userInfo);
                    await this._userRepository.addSessionToUser(user, accessToken);
                    return user;
                }
            } else { /* Auth0 says it's not a valid user. */
                return undefined;
            }
        }
    }
}

module.exports = Auth0AndMongoAuthorizer;