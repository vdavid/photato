import {convertObjectToQueryString} from '../website/httpHelper';

export interface SignedUrlParameters {
    environment: string;
    emailAddress: string;
    courseName: string;
    weekIndex: number;
    originalFileName: string;
    title: string;
    mimeType: string;
}

export default class PhotoUploader {
    /**
     * @param accessToken The JWT to pass as the authorization Bearer
     * @returns The URL.
     */
    async getSignedUrlFromServer(url: string, accessToken: string, parameters: SignedUrlParameters): Promise<string> {
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

    private _getSignedUrlFromServerOnce(url: string, accessToken: string, parameters: SignedUrlParameters): Promise<Response> {
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

    private _sleep(milliseconds: number): Promise<void> {
        return new Promise((resolve) => {setTimeout(resolve, milliseconds);});
    }

    uploadFile(url: string, file: File, setUploadProgressCallback: (progress: number) => void): Promise<ProgressEvent> {
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