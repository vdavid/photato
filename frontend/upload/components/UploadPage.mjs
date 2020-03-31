import {createElement, useState} from '/web_modules/react.js';
import {config} from '../../app/config.mjs';
import CourseDateConverter from '../../app/CourseDateConverter.mjs';

const courseDateConverter = new CourseDateConverter(config.course.startDateTime);

const statuses = {
    readyToSelectFile: Symbol('readyToSelectFile'),
    selectedFileIsTooSmall: Symbol('selectedFileIsTooSmall'),
    selectedFileIsTooLarge: Symbol('selectedFileIsTooLarge'),
    readyToUpload: Symbol('readyToUpload'),
    uploading: Symbol('uploading'),
    uploadDone: Symbol('uploadDone'),
    uploadFailed: Symbol('uploadFailed'),
};

const statusTexts = {
    [statuses.readyToSelectFile]: 'Please select your photo to upload.',
    [statuses.selectedFileIsTooSmall]: 'The image you\'ve selected is smaller than '
    + Math.round(config.imageUpload.minimumSizeInBytes / 1024) + ' kilobytes. Please select a higher resolution photo.',
    [statuses.selectedFileIsTooLarge]: 'The image you\'ve selected is larger than '
    + Math.round(config.imageUpload.minimumSizeInBytes / 1024 / 1024) + ' megabytes. Please select a smaller photo.',
    [statuses.readyToUpload]: 'Photo is ready to upload.',
    [statuses.uploading]: 'Uploading selected photo...',
    [statuses.uploadDone]: 'Upload done.',
    [statuses.uploadFailed]: 'Upload failed.',
};

export const UploadPage = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [status, setStatus] = useState(statuses.readyToSelectFile);
    const [uploadProgress, setUploadProgress] = useState(0.0);
    const [weekIndex] = useState(courseDateConverter.getWeekIndex());
    const [deadline] = useState(courseDateConverter.getWeekDeadline());

    // noinspection JSValidateJSDoc
    /**
     * @param {File} file
     * @returns {symbol}
     */
    function validateFile(file) {
        return ((file.size > config.imageUpload.maximumSizeInBytes)
            ? statuses.selectedFileIsTooLarge
            : ((file.size < config.imageUpload.minimumSizeInBytes)
                ? statuses.selectedFileIsTooSmall
                : statuses.readyToUpload));
    }

    /**
     * @param {Object} event
     */
    function handleFileSelected(event) {
        const file = event.target.files[0];
        if (file) {
            const newStatus = validateFile(file);
            setStatus(newStatus);
            if (newStatus === statuses.readyToUpload) {
                setSelectedFile(file);
                setUploadProgress(0.0);
            }
        } else {
            setSelectedFile(null);
            setStatus(statuses.readyToSelectFile);
            setUploadProgress(0.0);
        }
    }

    /**
     * @param {string} url
     * @param {File} file
     * @returns {Promise<unknown>} TODO: Figure out the type
     */
    function uploadFile(url, file) {
        return new Promise((resolve, reject) => {
            const formData = new FormData();
            formData.append('image', file);
            const xmlHttpRequest = new XMLHttpRequest();
            xmlHttpRequest.upload.addEventListener('progress', event => setUploadProgress(event.loaded / event.total), false);
            xmlHttpRequest.addEventListener('load', resolve, false);
            xmlHttpRequest.addEventListener('error', reject, false);
            xmlHttpRequest.addEventListener('abort', () => reject('User abort.'), false);
            xmlHttpRequest.open('POST', url);
            xmlHttpRequest.setRequestHeader('Content-Type', file.type);
            xmlHttpRequest.send(formData);
        });
    }

    async function uploadSelectedFile() {
        try {
            setStatus(statuses.uploading);

            const response = await uploadFile(config.backendApi.image.url, selectedFile);

            console.log(response);
            setStatus(statuses.uploadDone);
            setUploadProgress(1.0);
        } catch (error) {
            setStatus(statuses.uploadFailed);
            console.log(error);
        }
    }

    const formattedDeadline = new Intl.DateTimeFormat('hu-HU', {
        year: 'numeric', month: 'long', day: 'numeric', weekday: 'long', hour: 'numeric', minute: 'numeric'
    }).format(deadline);
    return createElement('section', {id: 'fileUpload'},
        createElement('h1', {}, 'Upload your weekly photo!'),
        createElement('p', {className: 'currentWeek'}, 'It\'s week #' + weekIndex
            + ', deadline is ' + formattedDeadline + '.'),
        createElement('form', {target: '', encType: 'multipart/form-data', method: 'post'},
            createElement('label', {}, 'Title', createElement('input', {
                    type: 'text',
                    name: 'title',
                    maxLength: 150,
                    disabled: status === statuses.uploading,
                })
            ),
            createElement('input', {
                type: 'file',
                name: 'image',
                accept: 'image/*',
                onChange: handleFileSelected,
                disabled: status === statuses.uploading,
            }),
            createElement('button', {
                onClick: uploadSelectedFile,
                disabled: status !== statuses.readyToUpload,
            }, 'Upload'),
            createElement('progress', {
                value: uploadProgress * 100,
                max: 100
            }),
            createElement('div', {
                className: 'status'
            }, statusTexts[status]),
        ),
    );
};