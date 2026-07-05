import React from 'react';
import FullWidthLocalImage from '../../components/FullWidthLocalImage';
import PhotoUploadLink from '../../components/PhotoUploadLink';

// noinspection JSUnusedGlobalSymbols (It's imported dynamically.)
/**
 * @param {string} formattedDeadline
 * @returns {React.ReactElement}
 */
export default function Week4Challenge({formattedDeadline}: {formattedDeadline: string}) {
    return <>
<p><strong>Röviden:</strong></p>

<p>A negyedik héten egy <strong>utcai fotót</strong> várunk tőled, amit <PhotoUploadLink label="itt tudsz feltölteni" />.</p>

<p><strong>Hosszabban:</strong></p>

<FullWidthLocalImage fileName="lomo.jpg" altText="Lomo" />

<p>Nagyon örülünk, hogy ilyen sokan beküldtétek az előző két hét képeit, és már a makrók is szépen érkezgetnek. 😊 Nagyon jó képeket küldtök, csak így tovább, és bátran adjatok tippeket/visszajelzéseket egymás képeire a galériákban.</p>

<p>A negyedik hét feladata, hogy légy néhány percre turista a saját városodban, és fotózd le az utca emberét. A legjobb képedet ${formattedDeadline}-ig, <PhotoUploadLink label="itt tudod feltölteni" />.</p>

<p>Ha még nem küldted be a múlt heti (makró) képedet, ma éjfélig még azt is <PhotoUploadLink label="megteheted" />. 🕚</p>

<p>Az utcai fotókat pedig <PhotoUploadLink label="itt" /> várjuk!</p>

<p>Jó fotózást,</p>

<p>--<br />
    a Photato csapata</p>
</>;
}