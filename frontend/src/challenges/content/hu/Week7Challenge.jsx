import React from 'react';
import PhotoUploadLink from '../../components/PhotoUploadLink.jsx';
import ExternalLink from '../../../materials/components/ExternalLink.jsx';

// noinspection JSUnusedGlobalSymbols (It's imported dynamically.)
/**
 * @param {string} formattedDeadline
 * @returns {React.ReactElement}
 */
export default function Week7Challenge({formattedDeadline}) {
    return <>
<p><strong>Röviden:</strong></p>

<p>Egy <strong>hosszú záridős fotót</strong> várunk tőled, amit <PhotoUploadLink label="itt tudsz feltölteni" />. Kedden közös fotózós esemény lesz, <ExternalLink href="https://www.facebook.com/events/2265483047079220/">jelentkezz itt!</ExternalLink></p>

<p><strong>Hosszabban:</strong></p>

<p>Ezen a héten a két héttel ezelőtti mozgás technikának az ellenkezőjét fogjuk megtanulni és gyakorolni. A múltkor az volt a cél, hogy nagyon élesen fotózzunk le gyorsan mozgó dolgokat. Most nem feltétlenül gyorsan mozgó dolgokat fogunk lefotózni úgy, hogy bemozduljon a kép c vagy annak bizonyos részei. A legjobb képedet ${formattedDeadline}-ig, <PhotoUploadLink label="itt tudod feltölteni" />.</p>

<p>Ha még nem küldted be a múlt heti (állatos/növényes) képedet, ma éjfélig még azt is <PhotoUploadLink label="megteheted" />. 🕚</p>

<p>A hosszú záridős képeket pedig <PhotoUploadLink label="itt" /> várjuk!</p>

<p>Jó fotózást,</p>

<p>--<br />
    a Photato csapata</p>
</>;
}