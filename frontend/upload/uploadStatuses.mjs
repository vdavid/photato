export const uploadStatuses = {
    readyToSelectFile: Symbol('readyToSelectFile'),
    selectedFileIsTooSmall: Symbol('selectedFileIsTooSmall'),
    selectedFileIsTooLarge: Symbol('selectedFileIsTooLarge'),
    readyToUpload: Symbol('readyToUpload'),
    uploading: Symbol('uploading'),
    uploadDone: Symbol('uploadDone'),
    uploadFailed: Symbol('uploadFailed'),
};
