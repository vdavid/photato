import {convertObjectToQueryString} from '../website/httpHelper.mjs';

export default class PhotoUploader {
    /**
     * @param {string} url
     * @param {string} accessToken The JWT to pass as the authorization Bearer
     * @param {{environment: string, emailAddress: string, courseName: string, weekIndex: int, originalFileName: string,
     *        title: string, mimeType: string}} parameters
     * @returns {Promise<string>} The URL.
     */
    async getSignedUrlFromServer(url, accessToken, parameters) {
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
        return response.text();
    }

    /**
     * @param {string} url
     * @param {File} file
     * @param {function(number): void} setUploadProgressCallback
     * @returns {Promise<unknown>} TODO: Figure out the type
     */
    uploadFile(url, file, setUploadProgressCallback) {
        return new Promise((resolve, reject) => {
            const xmlHttpRequest = new XMLHttpRequest();
            xmlHttpRequest.upload.addEventListener('progress', event => setUploadProgressCallback(event.loaded / event.total), false);
            xmlHttpRequest.addEventListener('load', resolve, false);
            xmlHttpRequest.addEventListener('error', reject, false);
            xmlHttpRequest.addEventListener('abort', () => reject('User abort.'), false);
            xmlHttpRequest.open('PUT', url);
            xmlHttpRequest.setRequestHeader('Content-Type', file.type);
            xmlHttpRequest.send(file);
        });
    }
}