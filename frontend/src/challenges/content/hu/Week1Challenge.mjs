import React from '../../../web_modules/react.js';
import FullWidthLocalImage from '../../components/FullWidthLocalImage.mjs';
import PhotoUploadLink from '../../components/PhotoUploadLink.mjs';

// noinspection JSUnusedGlobalSymbols (It's imported dynamically.)
/**
 * @param {string} formattedDeadline
 * @returns {React.ReactElement}
 */
export default function Week1Challenge({formattedDeadline}) {
    return <>
        <p>Az első hét témája: <strong>gasztrofotó</strong>!
        </p>
        <FullWidthLocalImage fileName="pizza.jpg" altText="pizza"/>
        <p>A gasztrofotózást tökéletes első témának tartjuk, mert kevés lelkesítőbb fotós kihívást ismerünk, mint finom, színes kajákat fényképezni 😋, és mert a legtöbben azért még bőven tanulhatunk arról, hogy hogyan lehet ezt igazán profin csinálni.</p>

        <p>
            <strong>Az első heti feladatod</strong> tehát ételeket/italokat fotózni, kiválasztani közülük a legjobbat, és ${formattedDeadline}-ig feltölteni <PhotoUploadLink label="ezen a linken"/>. A beazonosításhoz fontos, hogy a kép neve az email címed legyen: pl. “krumplipuree12@gmail.com.jpg”.
        </p>

    </>;
}