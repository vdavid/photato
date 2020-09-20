const HttpsConnector = require('../http/HttpsConnector.js');
const httpsConnector = new HttpsConnector();

class Auth0Authorizer {
    constructor(auth0UserInfoEndpoint) {
        this._auth0UserInfoEndpoint = auth0UserInfoEndpoint;
    }

    /**
     * @param {string} accessToken
     * @returns {Promise<Object|null>} Null in case of a bad token or request error.
     */
    async getAuth0UserInfo(accessToken) {
        try {
            const {statusCode, body} = await httpsConnector.requestPromisified(this._auth0UserInfoEndpoint, {
                method: 'get',
                headers: {'Authorization': 'Bearer ' + accessToken},
            });

            if (statusCode === 200) {
                return JSON.parse(body);
            } else {
                return null;
            }
        } catch (error) {
            console.info('Auth0Authorizer | Request error.', error);
            return null;
        }
    }
}

module.exports = Auth0Authorizer;