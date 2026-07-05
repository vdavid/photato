import React from 'react';
import FullWidthLocalImage from '../../components/FullWidthLocalImage.jsx';
import PhotoUploadLink from '../../components/PhotoUploadLink.jsx';

// noinspection JSUnusedGlobalSymbols (It's imported dynamically.)
/**
 * @param {string} formattedDeadline
 * @returns {React.ReactElement}
 */
export default function Week8Challenge({formattedDeadline}) {
    return <>
<p><strong>Röviden:</strong></p>
<p>Ezen a héten egy <strong>csendélet-jellegű fotót</strong> várunk tőled, amit <PhotoUploadLink label="itt tudsz feltölteni" />.</p>
<p><strong>Hosszabban:</strong></p>

<FullWidthLocalImage fileName="jama.jpg" altText="Jama" caption="© Farkas Antal Jama" captionLink="https://hu.wikipedia.org/wiki/Farkas_Antal_(fot%C3%B3m%C5%B1v%C3%A9sz)" />

<p>Az elmúlt 3 hétben sokan kültéren, komfortzónán kívüli helyzetekben fotóztatok dinamikus, nehéz témákat. Tudjuk, hogy ez gyakran trükkös volt, és ezúton gratulálunk a bátor próbálkozásokhoz és a jól sikerült fotókhoz!</p>
<p>Sunyi módon, miközben a fotózást gyakoroltad ezekben az éles helyzetekben, a fényképezőgép legbonyolultabb beállításai is bejöttek a képbe (záridő, blende és ISO érték), és gyakoroltad őket egy kicsit. A tanulás nehezén ezzel túl vagy, gratulálunk! 😊</p>
<p>Ezen a héten eggyel békésebb vizekre evezünk és biztosítjuk, hogy a fotótémád ne szaladjon el. Ami pedig az elméletet illeti, egyetlen igazán fontos beállítás van hátra: a <em>fehéregyensúly</em>.</p>


<p>Ha még nem küldted be a múlt heti (hosszú exponálási idejű) képedet, ma éjfélig még azt is <PhotoUploadLink label="megteheted" />. 🕚</p>
<p>A csendéleteket pedig ${formattedDeadline}-ig, <PhotoUploadLink label="itt tudod feltölteni" />.</p>
<p>Jó fotózást,</p>
<p>--<br />
    a Photato csapata</p>
</>;
}