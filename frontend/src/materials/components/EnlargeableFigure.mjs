import React, {useEffect, useRef, useState} from '../../web_modules/react.js';
import {config} from '../../config.mjs';
import {useI18n} from '../../i18n/components/I18nProvider.mjs';
import {useMaterialContext} from './MaterialContextProvider.mjs';

const fullscreenStatuses = {
    notFullscreen: 'notFullscreen',
    goingToFullscreen: 'goingToFullscreen',
    fullscreen: 'fullscreen',
};
/**
 * @param {string} fileName The file name for the full size file.
 * @param {string} [thumbnailFileName] If omitted, full size file name will be used.
 * @param {string} altText
 * @param {string} [caption]
 * @returns {React.ReactElement}
 * @constructor
 */
export default function EnlargeableFigure({fileName, thumbnailFileName, altText, caption}) {
    /* Get external data */
    const {getActiveLocaleCode} = useI18n();
    const languageCode = getActiveLocaleCode().substring(0, 2);
    const {metadata} = useMaterialContext();
    const imageBaseUrl = config.contentImages.externalArticlesBaseUrl + languageCode + '/' + metadata.slug + '/';

    /* Process arguments */
    const fullSizeImageUrl = assembleImageUrl(fileName);
    const thumbnailImageUrl = assembleImageUrl(thumbnailFileName || fileName);

    /* Element refs */
    const figureRef = useRef({});

    /* States */
    const [fullscreenStatus, setFullscreenStatus] = useState(fullscreenStatuses.notFullscreen);
    const [isFullSizeImagePreloaded, setFullSizeImagePreloaded] = useState(false);
    const isFullscreen = fullscreenStatus !== fullscreenStatuses.notFullscreen;

    /* Handles exiting the full-size image by pressing Escape */
    useEffect(() => {
        document.addEventListener('keydown', exitFullscreenOnEscape);
        return () => {
            document.removeEventListener('keydown', exitFullscreenOnEscape);
        };
    }, []);

    /* Handles full-size image loading and image src */
    useEffect(() => {
        if (fullscreenStatus === fullscreenStatuses.goingToFullscreen) {
            /* Replace thumbnail image with the full version */
            const downloadingImage = new Image();
            downloadingImage.onload = function () {
                setFullSizeImagePreloaded(true);
            };
            downloadingImage.onerror = function (error) {
                console.error(`Error loading ${this.src}: ${error.message}`);
            };
            downloadingImage.src = fullSizeImageUrl;

            setFullscreenStatus(fullscreenStatuses.fullscreen);
        }

    }, [fullscreenStatus]);
    const imageSrc = ((!isFullscreen || !isFullSizeImagePreloaded) ? thumbnailImageUrl : fullSizeImageUrl);

    return <div className={'zoomOnHover enlargeable' + (isFullscreen ? ' fullscreen' : '')}>
        <figure ref={figureRef}
                onClick={!isFullscreen ? fullscreenClick : exitFullscreen}
                style={getFigureStyle()}>
            <a href={!isFullscreen ? fullSizeImageUrl : ''}><img src={imageSrc} alt={altText}/></a>
            {caption && <figcaption>{caption}</figcaption>}
        </figure>
    </div>;

    /**
     * @param {string} fileName
     * @returns {string}
     * @private
     */
    function assembleImageUrl(fileName) {
        return imageBaseUrl + fileName;
    }

    /**
     * @returns {{top: string, left: string, width: string, height: string}}
     */
    function getFigureStyle() {
        const html = document.querySelector('html');
        const fullscreenStatusToFigureStyleMap = {
            [fullscreenStatuses.notFullscreen]: {left: '', top: '', width: '', height: ''},
            [fullscreenStatuses.goingToFullscreen]: {
                left: (figureRef.current.offsetLeft - html.scrollLeft) + 'px',
                top: (figureRef.current.offsetTop - html.scrollTop) + 'px',
                width: figureRef.current.offsetWidth + 'px',
                height: figureRef.current.offsetHeight + 'px'
            },
            [fullscreenStatuses.fullscreen]: {left: '0', top: '0', width: '100%', height: '100%'},
        };
        return fullscreenStatusToFigureStyleMap[fullscreenStatus];
    }

    function fullscreenClick(event) {
        /* Do not go to linked URL */
        event.preventDefault();

        setFullscreenStatus(fullscreenStatuses.goingToFullscreen);
    }

    function exitFullscreenOnEscape(event) {
        if (event.key === 'Escape') {
            exitFullscreen();
        }
    }

    function exitFullscreen(event) {
        /* Do not go to linked URL */
        event && event.preventDefault();

        setFullscreenStatus(fullscreenStatuses.notFullscreen);
    }
}
