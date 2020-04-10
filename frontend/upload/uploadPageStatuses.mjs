
/**
 * @type {Object<string, {name: string, isError: boolean}>}
 */
export const selectionStatuses = {
    readyToSelectFile: {name: 'readyToSelectFile', isError: false},
    selectedFileIsTooSmall: {name: 'selectedFileIsTooSmall', isError: true},
    selectedFileIsTooLarge: {name: 'selectedFileIsTooLarge', isError: true},
    readyToUpload: {name: 'readyToUpload', isError: false},
};

/**
 * @type {Object<string, {name: string, isError: boolean}>}
 */
export const uploadStatuses = {
    notStarted: {name: 'notStarted', isError: false},
    uploading: {name: 'uploading', isError: false},
    uploadDone: {name: 'uploadDone', isError: false},
    uploadFailed: {name: 'uploadFailed', isError: true},
};
