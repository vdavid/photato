import React, {useState, useEffect} from 'react';
import {config} from '../../config';
import {useAuth0} from '../../auth/components/Auth0Provider';
import {weeklyChallengeTitles} from '../../challenges/challengeRepository';
import {uploadStatuses, selectionStatuses} from '../uploadPageStatuses';
import FileSelectorWithPreview from './FileSelectorWithPreview';
import PhotoTitleInput from './PhotoTitleInput';
import {useI18n} from '../../i18n/components/I18nProvider';
import {useCourseData} from '../../challenges/components/CourseDataProvider';
import {formatDateWithWeekDayAndTime} from '../../website/dateTimeHelper';
import PhotoUploader from '../PhotoUploader';

interface SelectionStatus {
    name: string;
    isError: boolean;
}

function _validateSelectedFile(file: File): SelectionStatus {
    return ((file.size > config.imageUpload.maximumSizeInBytes)
        ? selectionStatuses.selectedFileIsTooLarge
        : ((file.size < config.imageUpload.minimumSizeInBytes)
            ? selectionStatuses.selectedFileIsTooSmall
            : ((file.type !== 'image/jpeg') ? selectionStatuses.wrongFileType : selectionStatuses.readyToUpload)));
}

interface UploadPageProps {
    photoUploader: PhotoUploader;
}

export default function UploadPage({photoUploader}: UploadPageProps) {
    const {isAuthenticated, user, getTokenSilently} = useAuth0();
    const {__, getActiveLocaleCode} = useI18n();
    const {currentWeekIndex, isCourseOver, isCourseRunning, getDeadline} = useCourseData();

    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [selectedFilePreviewUrl, setSelectedFilePreviewUrl] = useState('');
    const [selectionStatus, setSelectionStatus] = useState(selectionStatuses.readyToSelectFile);
    const [uploadStatus, setUploadStatus] = useState(uploadStatuses.notStarted);
    const [uploadProgress, setUploadProgress] = useState(0.0);
    const [title, setTitle] = useState('');

    useEffect(() => {
        async function setupAccessToken() {
            const token = await getTokenSilently();
            setAccessToken(token);
        }

        // noinspection JSIgnoredPromiseFromCall
        setupAccessToken();
        document.title = __('Photo upload') + ' - Photato';
    }, []);

    function handleFileSelected(file: File | null) {
        if (file) {
            const newStatus = _validateSelectedFile(file);
            setSelectionStatus(newStatus);
            if (newStatus === selectionStatuses.readyToUpload) {
                setSelectedFile(file);
                setSelectedFilePreviewUrl(URL.createObjectURL(file));
            } else {
                setSelectedFile(null);
                setSelectedFilePreviewUrl('');
            }
            setUploadProgress(0.0);
        }
    }

    function handleFileSelectionRemoved() {
        setSelectedFile(null);
        setSelectionStatus(selectionStatuses.readyToSelectFile);
        setSelectedFilePreviewUrl('');
        setUploadProgress(0.0);
    }

    function getSelectionStatusText(selectionStatus: SelectionStatus): string {
        const minimumSize = Math.round(config.imageUpload.minimumSizeInBytes / 1024);
        const maximumSize = Math.round(config.imageUpload.maximumSizeInBytes / 1024 / 1024);
        const selectionStatusTexts = {
            [selectionStatuses.readyToSelectFile.name]: __('Please select your photo to upload. (a JPEG file of maximum 25 megabytes)'),
            [selectionStatuses.selectedFileIsTooSmall.name]: __('The image you’ve selected is smaller than {minimumSize} kilobytes. This is just too small. Please select a bit higher resolution photo.', {minimumSize}),
            [selectionStatuses.selectedFileIsTooLarge.name]: __('The image you’ve selected is larger than {maximumSize} megabytes. We can’t handle a photo this big. Please select a smaller photo.', {maximumSize}),
            [selectionStatuses.wrongFileType.name]: __('The image you’ve selected is not a JPEG. Please select a JPEG file.', {maximumSize}),
            [selectionStatuses.readyToUpload.name]: __('Photo is ready to upload. (Make sure you gave it a title if you wanted!)'),
        };
        return selectionStatusTexts[selectionStatus.name];
    }

    function getUploadStatusText(uploadStatus: SelectionStatus): string {
        const uploadStatusTexts = {
            [uploadStatuses.notStarted.name]: '',
            [uploadStatuses.uploading.name]: __('Uploading your photo...'),
            [uploadStatuses.uploadDone.name]: __('We got your photo! Remember, if you want to change it, you can upload a new one by the end of the week.'),
            [uploadStatuses.uploadFailed.name]: __('Upload failed. Sorry about it. We don’t know what’s wrong. Please refresh the page and try again. It it keeps on failing, please drop us an email at {emailAddress}.', {emailAddress: config.customerServiceEmailAddress}),
        };
        return uploadStatusTexts[uploadStatus.name];
    }

    async function uploadSelectedFile() {
        try {
            setUploadStatus(uploadStatuses.uploading);

            const parameters = {
                environment: config.backendApi.environment,
                emailAddress: user!.email!,
                courseName: config.course.name,
                weekIndex: currentWeekIndex,
                originalFileName: selectedFile!.name,
                title,
                mimeType: selectedFile!.type,
            };
            const signedUrl = await photoUploader.getSignedUrlFromServer(config.backendApi.photoUpload.url, accessToken!, parameters);
            if (signedUrl) {
                const response = await photoUploader.uploadFile(signedUrl, selectedFile!, setUploadProgress);

                if ((response.target as XMLHttpRequest).status === 200) {
                    setUploadStatus(uploadStatuses.uploadDone);
                    setUploadProgress(1.0);
                } else {
                    setUploadStatus(uploadStatuses.uploadFailed);
                    console.error('Unknown error during the upload PUT part.');
                }
            } else {
                setUploadStatus(uploadStatuses.uploadFailed);
                console.error('Empty response from getSignedUrlFromServer. Perhaps a CORS error?');
            }
        } catch (error) {
            setUploadStatus(uploadStatuses.uploadFailed);
            console.error(error);
        }
    }

    const formattedDeadline = formatDateWithWeekDayAndTime(getDeadline(currentWeekIndex), getActiveLocaleCode());
    const courseStatusHelpText = isCourseRunning
        ? __('Submit your pic before {deadline}.\nNote: Please upload a photo you made this week. If you want to share your older pics, you’re welcome to send them in to the Facebook group.\nReminder: if you already submitted a photo this week, the new picture will replace it.', {deadline: formattedDeadline})
        : (isCourseOver
            ? __('The course has already ended. You can’t upload pics anymore. ☹')
            : __('The course has not started. You can upload your photos soon! 😊'));
    const canStartUpload = isAuthenticated
        && (selectionStatus === selectionStatuses.readyToUpload)
        && (uploadStatus !== uploadStatuses.uploading);

    return <div id='fileUpload'>
        <h1>{__('Photo upload')}</h1>
        <p className='currentWeek'>{__('Week #{weekIndex}', {weekIndex: currentWeekIndex})}</p>
        {isCourseRunning &&
        <h2>{__(weeklyChallengeTitles[currentWeekIndex - 1])}</h2>}
        <p className='preWrap'>{courseStatusHelpText}</p>
        {isCourseRunning &&
        <>
            <FileSelectorWithPreview onFileSelected={handleFileSelected}
                                     onFileRemoved={handleFileSelectionRemoved}
                                     isDisabled={!isAuthenticated || uploadStatus === uploadStatuses.uploading}
                                     selectedFile={selectedFile}
                                     selectedFilePreviewUrl={selectedFilePreviewUrl}/>
            <PhotoTitleInput title={title}
                             isDisabled={uploadStatus === uploadStatuses.uploading}
                             onChange={newTitle => setTitle(newTitle)}/>
            {uploadStatus === uploadStatuses.notStarted &&
            <div className={'selectionStatus' + (selectionStatus.isError ? ' error' : '')}>
                {getSelectionStatusText(selectionStatus)}
            </div>}
            <div className={'uploadStatus' + (selectionStatus.isError ? ' error' : (uploadStatus === uploadStatuses.uploadDone ? ' success' : ''))}>
                {[uploadStatuses.uploading, uploadStatuses.uploadDone, uploadStatuses.uploadFailed].includes(uploadStatus) &&
                <progress value={uploadProgress * 100} max={100}/>}
                <div>
                    {getUploadStatusText(uploadStatus)}
                </div>
            </div>
            <div className='uploadButton'>
                <button onClick={uploadSelectedFile}
                        disabled={!canStartUpload}>
                    {__('Upload')}
                </button>
            </div>
        </>}
    </div>;
}