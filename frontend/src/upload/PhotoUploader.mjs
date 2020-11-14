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
        try {
            return (await this._getSignedUrlFromServerOnce(url, accessToken, parameters)).text();
        } catch(error) { /* Try again once if 503 – this is because the lambda function tends to be slow the first time
                            and time out after 5 seconds (Lambda@Edge limit), but fast from then on. */
            await this._sleep(2000);
            console.log(error);
            console.log('Retrying...');
            try {
                return (await this._getSignedUrlFromServerOnce(url, accessToken, parameters)).text();
            } catch(error) {
                console.log(error);
                console.log('Retrying again...');
                return (await this._getSignedUrlFromServerOnce(url, accessToken, parameters)).text();
            }
        }
    }

    /**
     * @param {string} url
     * @param {string} accessToken The JWT to pass as the authorization Bearer
     * @param {{environment: string, emailAddress: string, courseName: string, weekIndex: int, originalFileName: string,
     *        title: string, mimeType: string}} parameters
     * @returns {Promise<Response>}
     * @private
     */
    _getSignedUrlFromServerOnce(url, accessToken, parameters) {
        return fetch(url + '?' + convertObjectToQueryString(parameters), {
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
    }

    /**
     * @param {int} milliseconds
     * @returns {Promise<void>}
     * @private
     */
    _sleep(milliseconds) {
        return new Promise((resolve) => {setTimeout(resolve, milliseconds);});
    }

    /**
     * @param {string} url
     * @param {File} file
     * @param {function(number): void} setUploadProgressCallback
     * @returns {Promise<ProgressEvent>}
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