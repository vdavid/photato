import {convertObjectToQueryString} from '../../website/httpHelper.mjs';

/**
 * @typedef {Object} PhotatoMessage
 * @property {string} slug Unique identifier of the message
 * @property {string} title Not used publicly, it's just to recognize the message.
 * @property {int} courseDayIndex The index of the day the message should be sent. Can be negative. 0 is the first Sunday.
 * @property {string} channel One of the `channels` constants
 * @property {string} audience One of the `emailAudiences` or `facebookAudiences` constants
 * @property {string} locale E.g. "en-US".
 * @property {string|undefined} subject Only for emails.
 * @property {string} contentType  One of the `contentTypes` constants
 * @property {string} content "text/plain" or "text/html".
 */

export default class PhotatoMessageRemoteRepository {
    /**
     * @param {string} url
     * @param {string} accessToken The JWT to pass as the authorization Bearer
     * @param {{environment: string}} parameters "development", "staging", or "production".
     * @returns {Promise<PhotatoMessage[]>}
     */
    async getAllPhotatoMessagesFromServer(url, accessToken, parameters) {
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
