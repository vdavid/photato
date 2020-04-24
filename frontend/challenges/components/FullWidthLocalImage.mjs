import {createElement} from '../../web_modules/react.js';

export default function FullWidthLocalImage({fileName, altText, caption, captionLink}) {
    if (caption) {
        return createElement('p', {style: {width: '100%', maxWidth: '800px', textAlign: 'center', fontSize: 'smaller'}},
            createElement('img', {src: '/challenges/illustrations/' + fileName, alt: altText, style: {width:'100%'}}),
            createElement('a', {href: captionLink}, caption)
        );
    } else {
        return createElement('img', {src: '/challenges/illustrations/' + fileName, alt: altText, style: {width:'100%'}});
    }
}