import {createElement, useState} from '/web_modules/react.js';
import {config} from '../../app/config.mjs';
import {weeklyChallengeTitles} from '../../app/challengeRepository.mjs';
import {uploadStatuses, uploadStatusTexts} from '../uploadStatuses.mjs';
import CourseDateConverter from '../../app/CourseDateConverter.mjs';
import PhotoUploader from '../PhotoUploader.mjs';
import FileSelectorWithPreview from './FileSelectorWithPreview.mjs';

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
    const [uploadStatus, setUploadStatus] = useState(uploadStatuses.readyToSelectFile);
    const [uploadProgress, setUploadProgress] = useState(0.0);
    const [weekIndex] = useState(courseDateConverter.getWeekIndex());
    const [deadline] = useState(new Date(courseDateConverter.getWeekDeadline() - ONE_MINUTE));

    /**
     * @param {Object} event
     */
    function handleFileSelected(event) {
        const file = event.target.files[0];
        if (file) {
            const newStatus = _validateFile(file);
            setUploadStatus(newStatus);
            if (newStatus === uploadStatuses.readyToUpload) {
                setSelectedFile(file);
                setUploadProgress(0.0);
            }
        } else {
            setSelectedFile(null);
            setUploadStatus(uploadStatuses.readyToSelectFile);
            setUploadProgress(0.0);
        }
    }

    async function uploadSelectedFile() {
        try {
            setUploadStatus(uploadStatuses.uploading);

            const parameters = {
                emailAddress: 'test@user.com',
                courseName: 'hu-3',
                weekIndex: '2',
                originalFileName: 'kukutyin.jpg',
                title: 'Test title',
                mimeType: 'image/jpg',
            };
            const signedUrl = await photoUploader.getSignedUrlFromServer(config.backendApi.photoUpload.url, parameters);
            const response = await photoUploader.uploadFile(signedUrl, selectedFile, setUploadProgress);

            console.log(response);
            setUploadStatus(uploadStatuses.uploadDone);
            setUploadProgress(1.0);
        } catch (error) {
            setUploadStatus(uploadStatuses.uploadFailed);
            console.log(error);
        }
    }

    const formattedDeadline = new Intl.DateTimeFormat('hu-HU', {
        year: 'numeric', month: 'long', day: 'numeric', weekday: 'long', hour: 'numeric', minute: 'numeric'
    }).format(deadline);

    return createElement('section', {id: 'fileUpload'},
        createElement('h1', {}, 'Upload your weekly photo!'),
        createElement('p', {className: 'currentWeek'}, "Week #" + weekIndex),
        createElement('h2', {}, weeklyChallengeTitles[weekIndex - 1]),
        createElement('p','Send in your pic before ' + formattedDeadline + '.'),
        createElement('form', {target: '', encType: 'multipart/form-data', method: 'post'},
            createElement('label', {}, 'Title', createElement('input', {
                    type: 'text',
                    name: 'title',
                    maxLength: 150,
                    disabled: uploadStatus === uploadStatuses.uploading,
                })
            ),
            createElement(FileSelectorWithPreview, {
                onFileSelected: handleFileSelected,
                isDisabled: uploadStatus === uploadStatuses.uploading,
            }),
            createElement('button', {
                onClick: uploadSelectedFile,
                disabled: uploadStatus !== uploadStatuses.readyToUpload,
            }, 'Upload'),
            createElement('progress', {
                value: uploadProgress * 100,
                max: 100
            }),
            createElement('div', {
                className: 'status'
            }, uploadStatusTexts[uploadStatus]),
        ),
    );
}