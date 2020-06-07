import React from '../../../web_modules/react.js';
import FullWidthLocalImage from '../../components/FullWidthLocalImage.mjs';
import PhotoUploadLink from '../../components/PhotoUploadLink.mjs';

// noinspection JSUnusedGlobalSymbols (It's imported dynamically.)
/**
 * @param {string} formattedDeadline
 * @returns {React.ReactElement}
 */
export default function Week3Challenge({formattedDeadline}) {
    return <>
<p><strong>Röviden:</strong></p>

<p>A harmadik héten egy <strong>makró fotót</strong> várunk tőled, amit <PhotoUploadLink label="itt tudsz feltölteni" />.</p>

<p><strong>Hosszabban:</strong></p>

<FullWidthLocalImage fileName="mosquitoes.jpg" altText="Légyott" />

<p>Ezen a héten megtanuljuk, mi az a makró, és hogyan érdemes 5 centiről krumplit fotózni.</p>
<p>A legjobb képedet ${formattedDeadline}-ig, <PhotoUploadLink label="itt tudod feltölteni" />.</p>


<p>Ha még nem küldted be a múlt heti (épületfotós) képedet, ma éjfélig még azt is <PhotoUploadLink label="megteheted" />. 🕚</p>

<p>A makrós képeket pedig <PhotoUploadLink label="itt" /> várjuk!</p>

<p>Jó fotózást,</p>
<p>--<br />
    a Photato csapata</p>
</>;
}