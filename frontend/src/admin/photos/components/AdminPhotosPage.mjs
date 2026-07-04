import React, {useEffect, useState} from '../../../web_modules/react.js';
import {config} from '../../../config.mjs';
import {useAuth0} from '../../../auth/components/Auth0Provider.mjs';
import {useI18n} from '../../../i18n/components/I18nProvider.mjs';
import PhotoRemoteRepository from '../PhotoRemoteRepository.mjs';
import ExternalLink from '../../../materials/components/ExternalLink.mjs';
import {useCourseData} from '../../../challenges/components/CourseDataProvider.mjs';

const photoRemoteRepository = new PhotoRemoteRepository();

export default function AdminPhotosPage() {
    const {getTokenSilently} = useAuth0();
    const {__, getActiveLocaleCode} = useI18n();
    const [/** @type {S3PhotoMetadata[]} */photos, setPhotos] = useState([]);
    const {currentWeekIndex} = useCourseData();
    const [weekIndex, setWeekIndex] = useState(currentWeekIndex);
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
                <a href="" key={weekIndex} data-value={weekIndex} onClick={(event) => { event.preventDefault(); setWeekIndex(event.target.getAttribute('data-value')); }}>{weekIndex}</a>)}
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
                weekIndex,
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
            {photos.map(buildPhotosTableRow)}
            </tbody>
        </table>;
    }

    /**
     * @param {S3PhotoMetadata} photo
     * @param {number} index
     * @returns {JSX.Element}
     */
    function buildPhotosTableRow(photo, index) {
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