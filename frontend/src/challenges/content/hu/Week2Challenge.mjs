import React from '../../../web_modules/react.js';
import FullWidthLocalImage from '../../components/FullWidthLocalImage.mjs';
import PhotoUploadLink from '../../components/PhotoUploadLink.mjs';

// noinspection JSUnusedGlobalSymbols (It's imported dynamically.)
/**
 * @param {string} formattedDeadline
 * @param {string} baseUrl
 * @returns {React.ReactElement}
 */
export default function Week2Challenge({formattedDeadline}) {
    return <>
<p><strong>Röviden:</strong></p>
<p>A második hét témája: <strong>épületfotók</strong>!</p>
<p>Közben gyorsan megtanuljuk, mi a zoom, a blende és a záridő.</p>
<p>A legjobb képedet <PhotoUploadLink label="itt tudod feltölteni" />.</p>

<p><strong>Hosszabban:</strong></p>

<FullWidthLocalImage fileName="taj-mahal.jpg" altText="Nyugati tér" />

<p>Az e heti feladat épületek, nevezetességek, terek fotózása lesz. A legjobb képedet ${formattedDeadline}-ig, <PhotoUploadLink label="itt tudod feltölteni" />.</p>

<p>A múlt héthez hasonlóan most is megpróbáltuk összeszedni nektek a legjobb tippjeinket:</p>


<p>Ha még nem küldted be a múlt heti (gasztrofotó) képedet, ma éjfélig még azt is <PhotoUploadLink label="megteheted" />. 🕚</p>

<p>Az épületes képeket pedig <PhotoUploadLink label="ide" /> várjuk!</p>

<p>Jó fotózást,</p>

<p>-- <br />
    a Photato csapata</p>
</>;
}