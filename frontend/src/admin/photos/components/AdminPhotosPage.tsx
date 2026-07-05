import React, {useEffect, useState} from 'react';
import {config} from '../../../config';
import {useAuth0} from '../../../auth/components/Auth0Provider';
import {useI18n} from '../../../i18n/components/I18nProvider';
import PhotoRemoteRepository from '../PhotoRemoteRepository';
import ExternalLink from '../../../materials/components/ExternalLink';
import {useCourseData} from '../../../challenges/components/CourseDataProvider';
import type {S3PhotoMetadata} from '../PhotoRemoteRepository';

const photoRemoteRepository = new PhotoRemoteRepository();

export default function AdminPhotosPage() {
    const {getTokenSilently} = useAuth0();
    const {__, getActiveLocaleCode} = useI18n();
    const [photos, setPhotos] = useState<S3PhotoMetadata[] | null>([]);
    const {currentWeekIndex} = useCourseData();
    const [weekIndex, setWeekIndex] = useState<number | string>(currentWeekIndex);
    const weekCount = config.course.weekCount;
    const weekIndexes = Array.from(Array(weekCount), (value, key) => key + 1);

    /* Load photos on component start */
    useEffect(() => {
        document.title = __('Photos') + ' - Photato admin';
    }, []);

    /* Render */
    return <>
        <h1>Photos for week #{weekIndex}</h1>
        <h2>Choose week</h2>
        <div className="weekIndexSelector">
            {weekIndexes.map(weekIndex =>
                <a href="" key={weekIndex} data-value={weekIndex} onClick={(event: React.MouseEvent) => { event.preventDefault(); setWeekIndex((event.target as HTMLElement).getAttribute('data-value')!); }}>{weekIndex}</a>)}
        </div>
        <p>
        <button onClick={() => loadPhotos()}>Download photo info without titles (faster)</button>
            <button onClick={() => loadPhotos(true)}>Download photo info with titles (slower)</button>
        </p>
        {photos ? <>
                {buildPhotosTable()}
                <p>Total uploaded photos: {photos.length}</p>
            </> :
            <p>Loading data...</p>}
    </>;

    /**
     * @param {boolean} [includeTitleAndContentType] Default: false
     * @returns {Promise<void>}
     */
    async function loadPhotos(includeTitleAndContentType = false) {
        setPhotos(null);
        try {
            const accessToken = await getTokenSilently();
            const photosFromRemote = await photoRemoteRepository.getAllPhotosForWeek({
                url: config.backendApi.adminListPhotosForWeek.url,
                accessToken,
                environment: config.backendApi.environment,
                courseName: config.course.name,
                // justification: weekIndex state can hold a string once a week link is clicked (getAttribute returns a string); cast keeps runtime identical (query string is the same) while satisfying the number-typed option.
                weekIndex: weekIndex as number,
                includeTitleAndContentType});
            setPhotos(photosFromRemote);
        } catch (error) {
            console.error('Could not load photos from remote:');
            console.error(error);
        }
    }

    function buildPhotosTable() {
        return <table className="adminPhotoListForWeek">
            <thead>
            <tr>
                <th>Email address</th>
                <th>Title</th>
                <th>Content type</th>
                <th>Size (in bytes)</th>
                <th>Upload date</th>
                <th>Link</th>
            </tr>
            </thead>
            <tbody>
            {photos!.map(buildPhotosTableRow)}
            </tbody>
        </table>;
    }

    function buildPhotosTableRow(photo: S3PhotoMetadata, index: number) {
        return <tr key={index}>
            <td>{photo.emailAddress}</td>
            <td>{photo.title === undefined ? '(Not retrieved)' : photo.title}</td>
            <td>{photo.contentType === undefined ? '(Not retrieved)' : photo.contentType}</td>
            <td>{new Intl.NumberFormat(getActiveLocaleCode()).format(photo.sizeInBytes)}</td>
            <td>{new Intl.DateTimeFormat(getActiveLocaleCode()).format(photo.lastModifiedDate)}</td>
            <td>
                <ExternalLink href={photo.url}>Link</ExternalLink>
            </td>
        </tr>;
    }
}