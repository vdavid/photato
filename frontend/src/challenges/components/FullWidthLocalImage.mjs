import React from '../../web_modules/react.js';

export default function FullWidthLocalImage({fileName, altText, caption, captionLink}) {
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