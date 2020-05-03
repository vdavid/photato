import {convertObjectToQueryString} from '../app/httpHelper.mjs';

export default class MessageRemoteRepository {
    /**
     * @param {string} url
     * @param {string} accessToken The JWT to pass as the authorization Bearer
     * @param {{environment: string}} parameters "development", "staging", or "production".
     * @returns {Promise<string>}
     */
    async getAllMessagesFromServer(url, accessToken, parameters) {
        const response = await fetch(url + '?' + convertObjectToQueryString(parameters), {
            method: 'GET', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'same-origin', // include, *same-origin, omit
            redirect: 'follow', // manual, *follow, error
            referrerPolicy: 'no-referrer', // no-referrer, *client
            headers: {
                Authorization: 'Bearer ' + accessToken
            },
        });
        return response.json();
    }

}
