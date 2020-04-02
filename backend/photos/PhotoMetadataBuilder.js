/**
 * @typedef {Object} PhotoMetadata
 * @property {string} emailAddress E-mail address of the uploader
 * @property {string} courseName E.g. "hu-3". Maximum 4 characters.
 * @property {int} weekIndex Zero-based
 * @property {string} originalFileName The original file name at the upload
 * @property {string|undefined} title Maximum 150 characters
 * @property {string} mimeType Must be "image/"...
 */

module.exports = class PhotoMetadataBuilder {
    /**
     * @param {string} string
     * @returns {boolean}
     */
    _isEmailAddress(string) {
        const emailAddressRegularExpression = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return emailAddressRegularExpression.test(string);
    }

    /**
     * @param {PhotoMetadata} fields
     * @returns {boolean}
     */
    _validateInput(fields) {
        return fields.emailAddress && this._isEmailAddress(fields.emailAddress)
            && fields.courseName && fields.courseName.length <= 4 && fields.courseName.match(/^[a-z][a-z]-[0-9]$/)
            && (fields.weekIndex !== undefined) && fields.weekIndex >= 0 && (fields.weekIndex <= 12)
            && fields.originalFileName && fields.originalFileName.length > 0 && fields.originalFileName.length <= 255
            && (!fields.title || fields.title.length <= 150)
            && fields.mimeType.startsWith('image/')
    }

    /**
     * @param {PhotoMetadata} fields The raw fields got from the user
     * @returns {PhotoMetadata} A well-formed metadata
     */
    createFromRawFields(fields) {
        if (this._validateInput(fields)) {
            // noinspection JSCheckFunctionSignatures
            return {
                emailAddress: fields.emailAddress,
                courseName: fields.courseName,
                weekIndex: parseInt(fields.weekIndex),
                originalFileName: fields.originalFileName,
                title: fields.title,
                mimeType: fields.mimeType,
            }
        } else {
            throw new Error('Wrong input from "' + fields.emailAddress.toString().substring(0, 100) + '".');
        }
    }
};