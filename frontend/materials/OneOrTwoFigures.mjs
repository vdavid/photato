import {config} from '../config.mjs';
import {createElement} from '../web_modules/react.js';
import {useI18n} from '../i18n/components/I18nProvider.mjs';

/**
 * @typedef {Object} FigureDefinition
 * @property {string} [thumbnailFileName] If omitted, full size file name will be used.
 * @property {string} fullSizeFileName
 * @property {string} altText
 * @property {string} [caption]
 */

export default function OneOrTwoFigures({thumbnailFileName1, fullSizeFileName1, altText1, caption1,
                                            thumbnailFileName2, fullSizeFileName2, altText2, caption2}) {
    const {getActiveLocaleCode} = useI18n();
    const languageCode = getActiveLocaleCode().substring(0, 2);
    const imageBaseUrl = config.contentImages.externalArticlesBaseUrl + languageCode + '/' + 'varosok-megorokitese' + '/';

    return createElement('div', {className: 'figures'},
        createFigure({thumbnailFileName: thumbnailFileName1, fullSizeFileName: fullSizeFileName1, altText: altText1, caption: caption1}),
        createFigure({thumbnailFileName: thumbnailFileName2, fullSizeFileName: fullSizeFileName2, altText: altText2, caption: caption2}),
    );

    /**
     * @param {FigureDefinition} figureDefinition
     * @returns {string}
     * @private
     */
    function createFigure({thumbnailFileName, fullSizeFileName, altText, caption}) {
        return createElement('div', {className: 'enlargeable'},
            createElement('figure', {},
                createElement('a', {href: assembleImageUrl(fullSizeFileName)},
                    createElement('img', {src: assembleImageUrl(thumbnailFileName || fullSizeFileName), alt: altText}),
                ),
                caption && createElement('figcaption', {}, caption)
            ),
        );
    }

    /**
     * @param {string} fileName
     * @returns {string}
     * @private
     */
    function assembleImageUrl(fileName) {
        return imageBaseUrl + fileName;
    }
}
