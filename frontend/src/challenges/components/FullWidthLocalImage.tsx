import React from 'react';

interface FullWidthLocalImageProps {
    fileName: string;
    altText?: string;
    /** Legacy: one call site passes `alt` instead of `altText`; it has never been rendered. Kept
     * optional to preserve that behavior, not forwarded. */
    alt?: string;
    caption?: string;
    captionLink?: string;
}

export default function FullWidthLocalImage({fileName, altText, caption, captionLink}: FullWidthLocalImageProps) {
    if (caption) {
        return <p style={{
            width: '100%',
            maxWidth: '800px',
            textAlign: 'center',
            fontSize: 'smaller'
        }}>
            <img src={'/challenges/illustrations/' + fileName} alt={altText} style={{width: '100%'}}/>
            <a href={captionLink}>{caption}</a>
        </p>;
    } else {
        return <img src={'/challenges/illustrations/' + fileName} alt={altText} style={{width: '100%'}}/>;
    }
}