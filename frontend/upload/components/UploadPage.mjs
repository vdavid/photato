import {createElement, useState} from '/web_modules/react.js';
import {config} from '../../app/config.mjs';
import {useAuth0} from '../../auth/components/Auth0Provider.mjs';
import {weeklyChallengeTitles} from '../../app/challengeRepository.mjs';
import {uploadStatuses} from '../uploadStatuses.mjs';
import CourseDateConverter from '../../app/CourseDateConverter.mjs';
import PhotoUploader from '../PhotoUploader.mjs';
import FileSelectorWithPreview from './FileSelectorWithPreview.mjs';
import PhotoTitleInput from './PhotoTitleInput.mjs';
import {useI18n} from '../../i18n/components/I18nProvider.mjs';

const courseDateConverter = new CourseDateConverter(config.course.startDateTime);
const photoUploader = new PhotoUploader();

// noinspection JSValidateJSDoc
/**
 * @param {File} file
 * @returns {symbol}
 */
function _validateFile(file) {
    return ((file.size > config.imageUpload.maximumSizeInBytes)
        ? uploadStatuses.selectedFileIsTooLarge
        : ((file.size < config.imageUpload.minimumSizeInBytes)
            ? uploadStatuses.selectedFileIsTooSmall
            : uploadStatuses.readyToUpload));
}

export default function UploadPage() {
    const ONE_MINUTE = 60 * 1000;

    const [selectedFile, setSelectedFile] = useState(null);
    const [selectedFilePreviewUrl, setSelectedFilePreviewUrl] = useState(null);
    const [uploadStatus, setUploadStatus] = useState(uploadStatuses.readyToSelectFile);
    const [uploadProgress, setUploadProgress] = useState(0.0);
    const [title, setTitle] = useState('');
    const [weekIndex] = useState(courseDateConverter.getWeekIndex());
    const [deadline] = useState(new Date(courseDateConverter.getWeekDeadline() - ONE_MINUTE));

    const {isAuthenticated, user} = useAuth0();
    const {__, getActiveLocaleCode} = useI18n();

    /**
     * @param {File|null} file
     */
    function handleFileSelected(file) {
        if (file) {
            const newStatus = _validateFile(file);
            setUploadStatus(newStatus);
            if (newStatus === uploadStatuses.readyToUpload) {
                setSelectedFile(file);
                setSelectedFilePreviewUrl(URL.createObjectURL(file));
                setUploadProgress(0.0);
            }
        }
    }

    function handleFileSelectionRemoved() {
        setSelectedFile(null);
        setUploadStatus(uploadStatuses.readyToSelectFile);
        setSelectedFilePreviewUrl(null);
        setUploadProgress(0.0);
    }

    function getUploadStatusText(uploadStatus) {
        const minimumSize = Math.round(config.imageUpload.minimumSizeInBytes / 1024);
        const maximumSize = Math.round(config.imageUpload.maximumSizeInBytes / 1024 / 1024);
        const uploadStatusTexts = {
            [uploadStatuses.readyToSelectFile]: __('Please select your photo to upload.'),
            [uploadStatuses.selectedFileIsTooSmall]: __('The image you\'ve selected is smaller than {minimumSize} kilobytes. This is just too small. Please select a bit higher resolution photo.', {minimumSize}),
            [uploadStatuses.selectedFileIsTooLarge]: __('The image you\'ve selected is larger than {maximumSize} megabytes. We can\'t handle a photo this big. Please select a smaller photo.', {maximumSize}),
            [uploadStatuses.readyToUpload]: __('Photo is ready to upload. (Make sure you gave it a title if you wanted!)'),
            [uploadStatuses.uploading]: __('Uploading your photo...'),
            [uploadStatuses.uploadDone]: __('We got your photo! Remember, if you want to change it, you can upload a new one by the end of the week.'),
            [uploadStatuses.uploadFailed]: __('Upload failed. Sorry about it. We don\'t know what\'s wrong. Please refresh the page and try again. It it keeps on failing, please drop us an email at {emailAddress}.', {emailAddress: config.customerServiceEmailAddress}),
        };
        return uploadStatusTexts[uploadStatus];
    }

    async function uploadSelectedFile() {
        try {
            setUploadStatus(uploadStatuses.uploading);

            const parameters = {
                emailAddress: user.email,
                courseName: config.course.name,
                weekIndex,
                originalFileName: selectedFile.name,
                title,
                mimeType: selectedFile.type,
            };
            const signedUrl = await photoUploader.getSignedUrlFromServer(config.backendApi.photoUpload.url, parameters);
            if (signedUrl) {
                const response = await photoUploader.uploadFile(signedUrl, selectedFile, setUploadProgress);

                if(response.target.status === 200) {
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

    const formattedDeadline = new Intl.DateTimeFormat(getActiveLocaleCode(), {
        year: 'numeric', month: 'long', day: 'numeric', weekday: 'long', hour: 'numeric', minute: 'numeric'
    }).format(deadline);

    return createElement('div', {id: 'fileUpload'},
        createElement('h1', {}, __('Upload your weekly photo!')),
        createElement('p', {className: 'currentWeek'}, __('Week #{weekIndex}', {weekIndex})),
        createElement('h2', {}, __(weeklyChallengeTitles[weekIndex - 1])),
        createElement('p', {}, __('Send in your pic before {deadline}.', {deadline: formattedDeadline})),
        createElement('form', {target: '', encType: 'multipart/form-data', method: 'post'},
            createElement(FileSelectorWithPreview, {
                onFileSelected: handleFileSelected,
                onFileRemoved: handleFileSelectionRemoved,
                isDisabled: !isAuthenticated || (uploadStatus === uploadStatuses.uploading),
                selectedFilePreviewUrl,
            }),
            createElement(PhotoTitleInput, {
                title,
                isDisabled: uploadStatus === uploadStatuses.uploading,
                onChange: newTitle => setTitle(newTitle),
            }),
            createElement('div', {className: 'uploadButton'},
                createElement('button', {
                    onClick: uploadSelectedFile,
                    disabled: !isAuthenticated || (uploadStatus !== uploadStatuses.readyToUpload),
                }, __('Upload')),
            ),
            createElement('div', {className: 'uploadStatus'},
                createElement('progress', {
                    value: uploadProgress * 100,
                    max: 100
                }),
                createElement('div', {}, getUploadStatusText(uploadStatus)),
            ),
        ),
    );
}