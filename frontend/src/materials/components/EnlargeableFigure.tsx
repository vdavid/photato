import React, {useEffect, useRef, useState} from 'react';
import {config} from '../../config';
import {useI18n} from '../../i18n/components/I18nProvider';
import {useMaterialContext} from './MaterialContextProvider';

const fullscreenStatuses = {
    notFullscreen: 'notFullscreen',
    goingToFullscreen: 'goingToFullscreen',
    fullscreen: 'fullscreen',
};

interface EnlargeableFigureProps {
    /** The file name for the full size file. */
    fileName: string;
    /** If omitted, full size file name will be used. */
    thumbnailFileName?: string;
    altText?: string;
    caption?: string;
}

export default function EnlargeableFigure({fileName, thumbnailFileName, altText, caption}: EnlargeableFigureProps) {
    /* Get external data */
    const {getActiveLocaleCode} = useI18n();
    const languageCode = getActiveLocaleCode().substring(0, 2);
    const {metadata} = useMaterialContext();
    const imageBaseUrl = config.contentImages.thirdPartyArticlesBaseUrl + languageCode + '/' + metadata.slug + '/';

    /* Process arguments */
    const fullSizeImageUrl = assembleImageUrl(fileName);
    const thumbnailImageUrl = assembleImageUrl(thumbnailFileName || fileName);

    /* Element refs */
    const figureRef = useRef<HTMLElement>(null);

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
                console.error(`Error loading ${(this as unknown as HTMLImageElement).src}: ${(error as unknown as ErrorEvent).message}`);
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

    function assembleImageUrl(fileName: string): string {
        return imageBaseUrl + fileName;
    }

    function getFigureStyle(): {left: string; top: string; width: string; height: string} {
        const html = document.querySelector('html');
        const figure = figureRef.current;
        /* This map is built eagerly every render. The `goingToFullscreen` entry is only ever *used*
         * after a click, when the figure is mounted; guard the ref reads so the eager build doesn't
         * throw on the first render (before the ref attaches). */
        const fullscreenStatusToFigureStyleMap: Record<string, {left: string; top: string; width: string; height: string}> = {
            [fullscreenStatuses.notFullscreen]: {left: '', top: '', width: '', height: ''},
            [fullscreenStatuses.goingToFullscreen]: (figure && html) ? {
                left: (figure.offsetLeft - html.scrollLeft) + 'px',
                top: (figure.offsetTop - html.scrollTop) + 'px',
                width: figure.offsetWidth + 'px',
                height: figure.offsetHeight + 'px'
            } : {left: '', top: '', width: '', height: ''},
            [fullscreenStatuses.fullscreen]: {left: '0', top: '0', width: '100%', height: '100%'},
        };
        return fullscreenStatusToFigureStyleMap[fullscreenStatus];
    }

    function fullscreenClick(event: React.MouseEvent) {
        /* Do not go to linked URL */
        event.preventDefault();

        setFullscreenStatus(fullscreenStatuses.goingToFullscreen);
    }

    function exitFullscreenOnEscape(event: KeyboardEvent) {
        if (event.key === 'Escape') {
            exitFullscreen();
        }
    }

    function exitFullscreen(event?: React.MouseEvent) {
        /* Do not go to linked URL */
        event && event.preventDefault();

        setFullscreenStatus(fullscreenStatuses.notFullscreen);
    }
}
