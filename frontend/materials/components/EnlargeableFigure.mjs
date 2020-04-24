import {createElement, useEffect, useRef, useState} from '../../web_modules/react.js';
import {useI18n} from '../../i18n/components/I18nProvider.mjs';
import {config} from '../../config.mjs';

const fullscreenStatuses = {
    notFullscreen: 'notFullscreen',
    goingToFullscreen: 'goingToFullscreen',
    fullscreen: 'fullscreen',
};
/**
 * @param {string} [thumbnailFileName] If omitted, full size file name will be used.
 * @param {string} fullSizeFileName
 * @param {string} altText
 * @param {string} [caption]
 * @returns {string}
 * @private
 */
export default function EnlargeableFigure({thumbnailFileName, fullSizeFileName, altText, caption}) {
    const {getActiveLocaleCode} = useI18n();
    const languageCode = getActiveLocaleCode().substring(0, 2);
    const imageBaseUrl = config.contentImages.externalArticlesBaseUrl + languageCode + '/' + 'varosok-megorokitese' + '/';
    const [fullscreenStatus, setFullscreenStatus] = useState(fullscreenStatuses.notFullscreen);
    const [isFullSizeImagePreloaded, setFullSizeImagePreloaded] = useState(false);
    const figureRef = useRef({});
    const fullSizeImageUrl = assembleImageUrl(fullSizeFileName);
    const thumbnailImageUrl = assembleImageUrl(thumbnailFileName || fullSizeFileName);
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

    /**/
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

    return createElement('div', {className: 'enlargeable' + (isFullscreen ? ' fullscreen' : '')},
        createElement('figure', {ref: figureRef, onClick: !isFullscreen ? fullscreenClick : exitFullscreen, style: getFigureStyle()},
            createElement('a', {href: !isFullscreen ? fullSizeImageUrl : ''},
                createElement('img', {src: imageSrc, alt: altText}),
            ),
            caption && createElement('figcaption', {}, caption)
        ),
    );

    /**
     * @param {string} fileName
     * @returns {string}
     * @private
     */
    function assembleImageUrl(fileName) {
        return imageBaseUrl + fileName;
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
