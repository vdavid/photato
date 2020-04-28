import React, {useEffect, useRef, useState} from '../../web_modules/react.js';
import {config} from '../../config.mjs';
import {useI18n} from '../../i18n/components/I18nProvider.mjs';
import {useMaterialContext} from './MaterialContextProvider.mjs';

/**
 * @param {string} fileName1
 * @param {string} fileName2
 * @param {string?} caption Figure caption (optional)
 * @param {string?} width Optional CSS width parameter. Default is "600px".
 * @returns {React.ReactElement}
 * @constructor
 */
export default function ImageComparisonWithSlider({fileName1, fileName2, caption, width = '600px'}) {
    /* Get external data */
    const {getActiveLocaleCode} = useI18n();
    const languageCode = getActiveLocaleCode().substring(0, 2);
    const {metadata} = useMaterialContext();
    const imageBaseUrl = config.contentImages.externalArticlesBaseUrl + languageCode + '/' + metadata.slug + '/';

    /* Element refs */
    const primaryImageRef = useRef({});
    const overlayImageRef = useRef({});
    const sliderRef = useRef({});

    /* State and refs to state */
    const [imageWidth, setImageWidth] = useState(0);
    const imageWidthRef = useRef();
    imageWidthRef.current = imageWidth;
    const [imageHeight, setImageHeight] = useState(0);
    const [sliderXPercent, setSliderXPercent] = useState(0.5);
    const [componentX, setComponentX] = useState(0);
    const componentXRef = useRef();
    componentXRef.current = componentX;
    const [isDragging, setDragging] = useState(false);
    const isDraggingRef = useRef();
    isDraggingRef.current = isDragging;

    /* Initialize dragging feature */
    useEffect(() => {
        if (sliderRef.current.tagName) {
            sliderRef.current.addEventListener('mousedown', startDragging);
            sliderRef.current.addEventListener('touchstart', startDragging);
            window.addEventListener('resize', updateImageDimensions);
            return () => {
                sliderRef.current.removeEventListener('mousedown', startDragging);
                sliderRef.current.removeEventListener('touchstart', startDragging);
                window.removeEventListener('resize', updateImageDimensions);
            };
        }
    }, [primaryImageRef.current]);

    const sliderTop = (imageHeight / 2) - (sliderRef.current.offsetHeight / 2);
    const sliderX = sliderXPercent * imageWidth;
    const overlayStyle = {left: sliderX + 'px', width: imageWidth - sliderX + 'px'};

    console.log(sliderX);
    return <div className='imageComparison' style={{width}}>
        <figure>
            <div className='primary'>
                <img ref={primaryImageRef} src={imageBaseUrl + fileName1} alt='Image 1' onLoad={updateImageDimensions} />
            </div>
            <div ref={sliderRef} className='slider' style={{left: sliderX + 'px', top: sliderTop + 'px'}}/>
            <div ref={overlayImageRef} className='overlay' style={overlayStyle}>
                <img src={imageBaseUrl + fileName2} alt="Image 2" />
            </div>
        </figure>
        {caption &&
        <figcaption>{caption}</figcaption>}
    </div>;

    function updateImageDimensions() {
        setComponentX(primaryImageRef.current.getBoundingClientRect().left);
        setImageWidth(primaryImageRef.current.offsetWidth || 0);
        setImageHeight(primaryImageRef.current.offsetHeight || 0);
    }

    function startDragging(event) {
        if (!isDraggingRef.current) {
            /* Prevent any other actions that may occur when moving over the image */
            event.preventDefault();
            window.addEventListener('mousemove', drag);
            window.addEventListener('touchmove', drag);
            window.addEventListener('mouseup', endDragging);
            window.addEventListener('touchstop', endDragging);
            setDragging(true);
        }
    }

    function drag(event) {
        if (isDraggingRef.current) {
            const cursorXRelativeToImage = event.pageX - componentXRef.current - window.scrollX;
            setSliderXPercent(Math.min(Math.max(cursorXRelativeToImage, 0), imageWidthRef.current) / imageWidthRef.current);
        }
    }

    function endDragging() {
        window.removeEventListener('mousemove', drag);
        window.removeEventListener('touchmove', drag);
        window.removeEventListener('mouseup', endDragging);
        window.removeEventListener('touchstop', endDragging);
        setDragging(false);
    }
}
