import {createElement, useState} from '/web_modules/react.js';
import {config} from '../../app/config.mjs';
import {useAuth0} from '../../app/react-auth0-spa.mjs';
import {weeklyChallengeTitles} from '../../app/challengeRepository.mjs';
import {uploadStatuses, uploadStatusTexts} from '../uploadStatuses.mjs';
import CourseDateConverter from '../../app/CourseDateConverter.mjs';
import PhotoUploader from '../PhotoUploader.mjs';
import FileSelectorWithPreview from './FileSelectorWithPreview.mjs';
import PhotoTitleInput from './PhotoTitleInput.mjs';

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

    const formattedDeadline = new Intl.DateTimeFormat('hu-HU', {
        year: 'numeric', month: 'long', day: 'numeric', weekday: 'long', hour: 'numeric', minute: 'numeric'
    }).format(deadline);

    return createElement('div', {id: 'fileUpload'},
        createElement('h1', {}, 'Upload your weekly photo!'),
        createElement('p', {className: 'currentWeek'}, "Week #" + weekIndex),
        createElement('h2', {}, weeklyChallengeTitles[weekIndex - 1]),
        createElement('p', 'Send in your pic before ' + formattedDeadline + '.'),
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
                }, 'Upload'),
            ),
            createElement('div', {className: 'uploadStatus'},
                createElement('progress', {
                    value: uploadProgress * 100,
                    max: 100
                }),
                createElement('div', {}, uploadStatusTexts[uploadStatus]),
            ),
        ),
    );
}