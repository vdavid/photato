const HttpsConnector = require('../http/HttpsConnector.js');
const httpsConnector = new HttpsConnector();

module.exports = class Authorizer {
    constructor(auth0UserInfoEndpoint) {
        this._auth0UserInfoEndpoint = auth0UserInfoEndpoint;
    }

    /**
     * @param {Object} event Must have a header called "Authorization" with a value like "Bearer {token}"
     * @returns {string}
     */
    extractBearerToken(event) {
        const authorizationHeader = event.headers.Authorization;
        return authorizationHeader.substring(authorizationHeader.indexOf(' ') + 1);
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