import React from '../../../web_modules/react.js';
import FullWidthLocalImage from '../../components/FullWidthLocalImage.mjs';
import PhotoUploadLink from '../../components/PhotoUploadLink.mjs';

// noinspection JSUnusedGlobalSymbols (It's imported dynamically.)
/**
 * @param {string} formattedDeadline
 * @param {string} baseUrl
 * @returns {React.ReactElement}
 */
export default function Week9Challenge({formattedDeadline}) {
    return <>
<p><strong>Röviden:</strong></p>
<p>A 9. héten egy <strong>portrét</strong> várunk tőled, amit <PhotoUploadLink label="itt tudsz feltölteni" />.</p>
<p><strong>Hosszabban:</strong></p>

        <p>A legtöbbünk életében egészen gyakran előfordul, hogy a barátainkat, családtagjainkat fotózzuk, ezért azt gondoltuk, mindannyiunknak hasznos lehet, ha megpróbálunk szintet lépni az ilyen típusú fotók készítésében. A stúdióban, tökéletesre csiszolt megvilágítással és milliós géppel készült portréfotózást meghagyjuk egy szűk elitnek, a cél inkább az, hogy megkapargassuk a portréfotózás tudományának felszínét. A legjobb képedet ${formattedDeadline}-ig, <PhotoUploadLink label="itt tudod majd feltölteni" />.</p>

        <FullWidthLocalImage fileName="mustache-guy.jpg" altText="Bajszos csávó" />


<p>Ha még nem küldted be a múlt heti (csendéletes) képedet, ma éjfélig még azt is <PhotoUploadLink label="megteheted" />. 🕚</p>
<p>A portrékat pedig <PhotoUploadLink label="itt" /> várjuk!</p>
<p>Jó fotózást,</p>
<p>--<br />
    a Photato csapata</p>
</>;
}