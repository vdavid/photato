import {createElement, useState, useEffect} from '../../web_modules/react.js';
import {config} from '../../config.mjs';
import {useAuth0} from '../../auth/components/Auth0Provider.mjs';
import {weeklyChallengeTitles} from '../../challenges/challengeRepository.mjs';
import {uploadStatuses, selectionStatuses} from '../uploadPageStatuses.mjs';
import FileSelectorWithPreview from './FileSelectorWithPreview.mjs';
import PhotoTitleInput from './PhotoTitleInput.mjs';
import {useI18n} from '../../i18n/components/I18nProvider.mjs';
import {useCourseData} from '../../challenges/components/CourseDataProvider.mjs';

// noinspection JSValidateJSDoc
/**
 * @param {File} file
 * @returns {{name: string, isError: boolean}}
 */
function _validateSelectedFile(file) {
    return ((file.size > config.imageUpload.maximumSizeInBytes)
        ? selectionStatuses.selectedFileIsTooLarge
        : ((file.size < config.imageUpload.minimumSizeInBytes)
            ? selectionStatuses.selectedFileIsTooSmall
            : ((file.type !== 'image/jpeg') ? selectionStatuses.wrongFileType : selectionStatuses.readyToUpload)));
}

export default function UploadPage({photoUploader}) {
    const {isAuthenticated, user, getTokenSilently} = useAuth0();
    const {__, getActiveLocaleCode} = useI18n();
    const {currentWeekIndex, isCourseOver, isCourseRunning, getFormattedDeadline} = useCourseData();

    const [accessToken, setAccessToken] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [selectedFilePreviewUrl, setSelectedFilePreviewUrl] = useState(null);
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
    }, []);

    /**
     * @param {File|null} file
     */
    function handleFileSelected(file) {
        if (file) {
            const newStatus = _validateSelectedFile(file);
            setSelectionStatus(newStatus);
            if (newStatus === selectionStatuses.readyToUpload) {
                setSelectedFile(file);
                setSelectedFilePreviewUrl(URL.createObjectURL(file));
            } else {
                setSelectedFile(null);
                setSelectedFilePreviewUrl(null);
            }
            setUploadProgress(0.0);
        }
    }

    function handleFileSelectionRemoved() {
        setSelectedFile(null);
        setSelectionStatus(selectionStatuses.readyToSelectFile);
        setSelectedFilePreviewUrl(null);
        setUploadProgress(0.0);
    }

    /**
     * @param {{name: string, isError: boolean}} selectionStatus
     * @returns {string}
     */
    function getSelectionStatusText(selectionStatus) {
        const minimumSize = Math.round(config.imageUpload.minimumSizeInBytes / 1024);
        const maximumSize = Math.round(config.imageUpload.maximumSizeInBytes / 1024 / 1024);
        const selectionStatusTexts = {
            [selectionStatuses.readyToSelectFile.name]: __('Please select your photo to upload.'),
            [selectionStatuses.selectedFileIsTooSmall.name]: __('The image you’ve selected is smaller than {minimumSize} kilobytes. This is just too small. Please select a bit higher resolution photo.', {minimumSize}),
            [selectionStatuses.selectedFileIsTooLarge.name]: __('The image you’ve selected is larger than {maximumSize} megabytes. We can’t handle a photo this big. Please select a smaller photo.', {maximumSize}),
            [selectionStatuses.wrongFileType.name]: __('The image you’ve selected is not a JPEG. Please select a JPEG file.', {maximumSize}),
            [selectionStatuses.readyToUpload.name]: __('Photo is ready to upload. (Make sure you gave it a title if you wanted!)'),
        };
        return selectionStatusTexts[selectionStatus.name];
    }

    /**
     * @param {{name: string, isError: boolean}} uploadStatus
     * @returns {string}
     */
    function getUploadStatusText(uploadStatus) {
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
                environment: config.environment,
                emailAddress: user.email,
                courseName: config.course.name,
                weekIndex: currentWeekIndex,
                originalFileName: selectedFile.name,
                title,
                mimeType: selectedFile.type,
            };
            const signedUrl = await photoUploader.getSignedUrlFromServer(config.backendApi.photoUpload.url, accessToken, parameters);
            if (signedUrl) {
                const response = await photoUploader.uploadFile(signedUrl, selectedFile, setUploadProgress);

                if (response.target.status === 200) {
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

    const formattedDeadline = getFormattedDeadline(currentWeekIndex, getActiveLocaleCode());
    const courseStatusHelpText = isCourseRunning
        ? __('Send in your pic before {deadline}.\nReminder: if you already submitted a photo this week, the new picture will replace it.', {deadline: formattedDeadline})
        : (isCourseOver
            ? __('The course has already ended. You can’t upload pics anymore. ☹')
            : __('The course has not started. You can upload your photos soon! 😊'));

    return createElement('div', {id: 'fileUpload'},
        createElement('h1', {}, __('Photo upload')),
        createElement('p', {className: 'currentWeek'}, __('Week #{weekIndex}', {weekIndex: currentWeekIndex})),
        isCourseRunning && createElement('h2', {}, __(weeklyChallengeTitles[currentWeekIndex - 1])),
        createElement('p', {className: 'preWrap'}, courseStatusHelpText),
        isCourseRunning
            ? [
                createElement(FileSelectorWithPreview, {
                    onFileSelected: handleFileSelected,
                    onFileRemoved: handleFileSelectionRemoved,
                    isDisabled: !isAuthenticated || (uploadStatus === uploadStatuses.uploading),
                    selectedFile,
                    selectedFilePreviewUrl,
                }),
                createElement(PhotoTitleInput, {
                    title,
                    isDisabled: uploadStatus === uploadStatuses.uploading,
                    onChange: newTitle => setTitle(newTitle),
                }),
                createElement('div', {className: 'selectionStatus' + (selectionStatus.isError ? ' error' : '')}, getSelectionStatusText(selectionStatus)),
                createElement('div', {className: 'uploadButton'},
                    createElement('button', {
                        onClick: uploadSelectedFile,
                        disabled: !isAuthenticated || (selectionStatus !== selectionStatuses.readyToUpload),
                    }, __('Upload')),
                ),
                createElement('div', {className: 'uploadStatus' + (selectionStatus.isError ? ' error' : '')},
                    ([uploadStatuses.uploading, uploadStatuses.uploadDone, uploadStatuses.uploadFailed].includes(uploadStatus)
                        ? createElement('progress', {
                            value: uploadProgress * 100,
                            max: 100
                        }) : null),
                    createElement('div', {}, getUploadStatusText(uploadStatus)),
                ),
            ] : null,
    );
}