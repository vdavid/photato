import {createElement} from '../../web_modules/react.js';
import EnlargeableFigure from './EnlargeableFigure.mjs';

export default function TwoEnlargeableFigures(
    {thumbnailFileName1, fullSizeFileName1, altText1, caption1, thumbnailFileName2, fullSizeFileName2, altText2, caption2}) {

    return createElement('div', {className: 'figures'},
        EnlargeableFigure({thumbnailFileName: thumbnailFileName1, fullSizeFileName: fullSizeFileName1, altText: altText1, caption: caption1}),
        EnlargeableFigure({thumbnailFileName: thumbnailFileName2, fullSizeFileName: fullSizeFileName2, altText: altText2, caption: caption2}),
    );
}
