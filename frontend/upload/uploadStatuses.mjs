import {config} from '../app/config.mjs';

export const uploadStatuses = {
    readyToSelectFile: Symbol('readyToSelectFile'),
    selectedFileIsTooSmall: Symbol('selectedFileIsTooSmall'),
    selectedFileIsTooLarge: Symbol('selectedFileIsTooLarge'),
    readyToUpload: Symbol('readyToUpload'),
    uploading: Symbol('uploading'),
    uploadDone: Symbol('uploadDone'),
    uploadFailed: Symbol('uploadFailed'),
};

export const uploadStatusTexts = {
    [uploadStatuses.readyToSelectFile]: 'Please select your photo to upload.',
    [uploadStatuses.selectedFileIsTooSmall]: 'The image you\'ve selected is smaller than '
    + Math.round(config.imageUpload.minimumSizeInBytes / 1024) + ' kilobytes. Please select a higher resolution photo.',
    [uploadStatuses.selectedFileIsTooLarge]: 'The image you\'ve selected is larger than '
    + Math.round(config.imageUpload.minimumSizeInBytes / 1024 / 1024) + ' megabytes. Please select a smaller photo.',
    [uploadStatuses.readyToUpload]: 'Photo is ready to upload.',
    [uploadStatuses.uploading]: 'Uploading selected photo...',
    [uploadStatuses.uploadDone]: 'Upload done.',
    [uploadStatuses.uploadFailed]: 'Upload failed.',
};
