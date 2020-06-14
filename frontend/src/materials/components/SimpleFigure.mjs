import React from '../../web_modules/react.js';
import {config} from '../../config.mjs';
import {useI18n} from '../../i18n/components/I18nProvider.mjs';
import {useMaterialContext} from './MaterialContextProvider.mjs';

/**
 * @param {string} fileName
 * @param {string} altText
 * @param {string} [titleText]
 * @param {string} [caption]
 * @param {string} [width] CSS width for the element. Default is "100%".
 * @returns {React.ReactElement}
 * @private
 */
export default function SimpleFigure({fileName, altText, titleText, caption, width = '100%'}) {
    const {getActiveLocaleCode} = useI18n();
    const languageCode = getActiveLocaleCode().substring(0, 2);
    const {metadata} = useMaterialContext();
    const imageBaseUrl = config.contentImages.thirdPartyArticlesBaseUrl + languageCode + '/' + metadata.slug + '/';
    const imageUrl = imageBaseUrl + fileName;

    return <div className='simpleFigure'>
        <figure style={{width}}>
            <img src={imageUrl} alt={altText} title={titleText}/>{caption &&
        <figcaption>{caption}</figcaption>}
        </figure>
    </div>;
}
