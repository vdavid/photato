const HttpsConnector = require('../http/HttpsConnector.js');
const httpsConnector = new HttpsConnector();

module.exports = class Auth0Authorizer {
    constructor(auth0UserInfoEndpoint) {
        this._auth0UserInfoEndpoint = auth0UserInfoEndpoint;
    }

    /**
     * @param {string} accessToken
     * @returns {Promise<object>}
     */
    async getAuth0UserData(accessToken) {
        const {statusCode, body} = await httpsConnector.requestPromisified(this._auth0UserInfoEndpoint, {
            method: 'get',
            headers: {'Authorization': 'Bearer ' + accessToken},
        });

        if (statusCode === 200) {
            return JSON.parse(body);
        } else {
            throw new Error('Bad token.');
        }
    }
};