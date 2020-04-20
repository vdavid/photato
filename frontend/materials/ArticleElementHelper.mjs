/**
 * @typedef {Object} FigureDefinition
 * @property {string} [thumbnailFileName] If omitted, full size file name will be used.
 * @property {string} fullSizeFileName
 * @property {string} altText
 * @property {string} [caption]
 */

export default class ArticleElementHelper {
    /**
     * @param {string} imageBaseUrl Including the last slash.
     */
    constructor({imageBaseUrl}) {
        this._imageBaseUrl = imageBaseUrl;
    }

    /**
     * @param {FigureDefinition} figureDefinition1
     * @param {FigureDefinition} [figureDefinition2]
     * @returns {string}
     */
    createOneOrTwoFigures(figureDefinition1, figureDefinition2) {
        return `<div class="figures">`
            + this._createFigure(figureDefinition1)
            + this._createFigure(figureDefinition2)
            + `</div>`;
    }

    /**
     * @param {FigureDefinition} figureDefinition
     * @returns {string}
     * @private
     */
    _createFigure({thumbnailFileName, fullSizeFileName, altText, caption}) {
        return `<div class="enlargeable"><figure>`
            + `<a href="${this._assembleImageUrl(fullSizeFileName)}">`
            + `<img src="${this._assembleImageUrl(thumbnailFileName || fullSizeFileName)}" alt="${altText}" />`
            + `</a>`
            + (caption ? `<figcaption>${caption}</figcaption>` : '')
            + `</figure></div>`;
    }

    /**
     * @param {string} fileName
     * @returns {string}
     * @private
     */
    _assembleImageUrl(fileName) {
        return this._imageBaseUrl + fileName;
    }
}