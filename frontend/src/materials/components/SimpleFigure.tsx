import React from 'react';
import {config} from '../../config';
import {useI18n} from '../../i18n/components/I18nProvider';
import {useMaterialContext} from './MaterialContextProvider';

interface SimpleFigureProps {
    fileName: string;
    altText?: string;
    /** Legacy: some call sites pass `alt` instead of `altText`. It has never been rendered (only
     * `altText` reaches the `<img>`); kept optional to preserve that behavior, not forwarded. */
    alt?: string;
    titleText?: string;
    caption?: string;
    /** CSS width for the element. Default is "100%". */
    width?: string;
}

export default function SimpleFigure({fileName, altText, titleText, caption, width = '100%'}: SimpleFigureProps) {
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
