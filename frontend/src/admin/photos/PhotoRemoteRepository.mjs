import {convertObjectToQueryString} from '../../website/httpHelper.mjs';

/**
 * @typedef {Object} S3PhotoMetadata
 * @property {string} key
 * @property {string} fileName
 * @property {string} url
 * @property {string} emailAddress
 * @property {string} title
 * @property {string} contentType
 * @property {int} sizeInBytes
 * @property {Date} lastModifiedDate
 */

export default class PhotoRemoteRepository {
    /**
     * @param {string} url
     * @param {string} accessToken The JWT to pass as the authorization Bearer
     * @param {string} environment "development", "staging", or "production".
     * @param {string} courseName E.g. "hu-4"
     * @param {int} weekIndex One-based
     * @param {boolean} [includeTitleAndContentType] Default: false. If this is false, then the title and content type won't be retrieved, but the response will come much faster.
     * @returns {Promise<S3PhotoMetadata[]>}
     */
    async getAllPhotosForWeek({url, accessToken, environment, courseName, weekIndex, includeTitleAndContentType}) {
        const response = await fetch(url + '?' + convertObjectToQueryString({environment, courseName, weekIndex, getDetails: includeTitleAndContentType ? 'true' : ''}), {
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
        const responseList = await response.json();
        responseList.forEach(photoMetadata => photoMetadata.lastModifiedDate = new Date(photoMetadata.lastModifiedDate));
        return responseList;
    }

}
