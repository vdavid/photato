import React, {useEffect, useRef, useState} from 'react';
import {config} from '../../config';
import {useI18n} from '../../i18n/components/I18nProvider';
import {useMaterialContext} from './MaterialContextProvider';

interface ImageComparisonWithSliderProps {
    fileName1: string;
    fileName2: string;
    /** Figure caption (optional) */
    caption?: string;
    /** Optional CSS width parameter. Default is "600px". */
    width?: string;
}

export default function ImageComparisonWithSlider({fileName1, fileName2, caption, width = '600px'}: ImageComparisonWithSliderProps) {
    /* Get external data */
    const {getActiveLocaleCode} = useI18n();
    const languageCode = getActiveLocaleCode().substring(0, 2);
    const {metadata} = useMaterialContext();
    const imageBaseUrl = config.contentImages.thirdPartyArticlesBaseUrl + languageCode + '/' + metadata.slug + '/';

    /* Element refs */
    const primaryImageRef = useRef<HTMLImageElement>(null);
    const overlayImageRef = useRef<HTMLDivElement>(null);
    const sliderRef = useRef<HTMLDivElement>(null);

    /* State and refs to state */
    const [imageWidth, setImageWidth] = useState(0);
    const imageWidthRef = useRef(0);
    imageWidthRef.current = imageWidth;
    const [imageHeight, setImageHeight] = useState(0);
    const [sliderXPercent, setSliderXPercent] = useState(0.5);
    const [componentX, setComponentX] = useState(0);
    const componentXRef = useRef(0);
    componentXRef.current = componentX;
    const [isDragging, setDragging] = useState(false);
    const isDraggingRef = useRef(false);
    isDraggingRef.current = isDragging;

    /* Initialize dragging feature */
    useEffect(() => {
        const slider = sliderRef.current;
        if (slider && slider.tagName) {
            slider.addEventListener('mousedown', startDragging);
            slider.addEventListener('touchstart', startDragging);
            window.addEventListener('resize', updateImageDimensions);
            return () => {
                slider.removeEventListener('mousedown', startDragging);
                slider.removeEventListener('touchstart', startDragging);
                window.removeEventListener('resize', updateImageDimensions);
            };
        }
    }, [primaryImageRef.current]);

    const sliderTop = (imageHeight / 2) - ((sliderRef.current?.offsetHeight ?? 0) / 2);
    const sliderX = sliderXPercent * imageWidth;
    const overlayStyle = {left: sliderX + 'px', width: imageWidth - sliderX + 'px'};

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
        if (!primaryImageRef.current) return;
        setComponentX(primaryImageRef.current.getBoundingClientRect().left);
        setImageWidth(primaryImageRef.current.offsetWidth || 0);
        setImageHeight(primaryImageRef.current.offsetHeight || 0);
    }

    function startDragging(event: Event) {
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

    function drag(event: MouseEvent | TouchEvent) {
        if (isDraggingRef.current) {
            const cursorXRelativeToImage = (event as MouseEvent).pageX - componentXRef.current - window.scrollX;
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
