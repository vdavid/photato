import {createElement} from '../../web_modules/react.js';
import EnlargeableFigure from './EnlargeableFigure.mjs';

export default function TwoEnlargeableFigures(
    {fileName1, thumbnailFileName1, altText1, caption1, fileName2, thumbnailFileName2, altText2, caption2}) {

    return createElement('div', {className: 'figures'},
        EnlargeableFigure({fileName: fileName1, thumbnailFileName: thumbnailFileName1, altText: altText1, caption: caption1}),
        EnlargeableFigure({fileName: fileName2, thumbnailFileName: thumbnailFileName2, altText: altText2, caption: caption2}),
    );
}
