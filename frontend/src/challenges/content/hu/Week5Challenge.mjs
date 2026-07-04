import React from '../../../web_modules/react.js';
import PhotoUploadLink from '../../components/PhotoUploadLink.mjs';

// noinspection JSUnusedGlobalSymbols (It's imported dynamically.)
/**
 * @param {string} formattedDeadline
 * @returns {React.ReactElement}
 */
export default function Week5Challenge({formattedDeadline}) {
    return <>
<p><strong>Röviden:</strong></p>

<ul>
    <li>Egy <strong>gyorsan mozgó dologról készült fotót</strong> várunk tőled, és <PhotoUploadLink label="itt tudod feltölteni" />.</li>
    <li>Ezen a héten elmagyarázunk némi elméletet, ami eddig hiányozhatott a tarsolyodból.</li>
</ul>

<p><strong>Hosszabban:</strong></p>

<p><strong>Gyorsan mozgó dolgok fotózása fényképezőgéppel:</strong></p>

<p>A legjobb gyorsan mozgó képedet ${formattedDeadline}-ig, <PhotoUploadLink label="itt tudod feltölteni" />.</p>

<p>Ha még nem küldted be a múlt heti (utcai fotós) képedet, ma éjfélig még azt is <PhotoUploadLink label="megteheted" />. 🕚</p>

<p>Jó fotózást,</p>

<p>--<br />
    a Photato csapata</p>
</>;
}