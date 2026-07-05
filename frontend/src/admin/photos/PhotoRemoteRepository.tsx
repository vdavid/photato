import {convertObjectToQueryString} from '../../website/httpHelper';

/** A photo's metadata as it arrives over the wire from the Go backend's `list-for-week` endpoint:
 * `lastModifiedDate` is an ISO date string. */
export interface S3PhotoMetadataWire {
    key: string;
    fileName: string;
    url: string;
    emailAddress: string;
    title: string;
    contentType: string;
    sizeInBytes: number;
    lastModifiedDate: string;
}

/** The domain shape after revival: `lastModifiedDate` is a real `Date`. */
export interface S3PhotoMetadata extends Omit<S3PhotoMetadataWire, 'lastModifiedDate'> {
    lastModifiedDate: Date;
}

interface GetAllPhotosForWeekOptions {
    url: string;
    /** The JWT to pass as the authorization Bearer */
    accessToken: string;
    /** "development", "staging", or "production". */
    environment: string;
    /** E.g. "hu-4" */
    courseName: string;
    /** One-based */
    weekIndex: number;
    /** Default: false. If this is false, then the title and content type won't be retrieved, but the response will come much faster. */
    includeTitleAndContentType?: boolean;
}

export default class PhotoRemoteRepository {
    async getAllPhotosForWeek({url, accessToken, environment, courseName, weekIndex, includeTitleAndContentType}: GetAllPhotosForWeekOptions): Promise<S3PhotoMetadata[]> {
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
        const responseList: S3PhotoMetadataWire[] = await response.json();
        /* Revive the wire ISO string into a domain Date. */
        return responseList.map(photoMetadata => ({...photoMetadata, lastModifiedDate: new Date(photoMetadata.lastModifiedDate)}));
    }

}
