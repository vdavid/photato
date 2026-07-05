import React from 'react';
import FullWidthLocalImage from '../../components/FullWidthLocalImage';
import PhotoUploadLink from '../../components/PhotoUploadLink';

// noinspection JSUnusedGlobalSymbols (It's imported dynamically.)
/**
 * @param {string} formattedDeadline
 * @returns {React.ReactElement}
 */
export default function Week6Challenge({formattedDeadline}: {formattedDeadline: string}) {
    return <>
<p>Kedves *|FNAME|*,</p>
<p><strong>Röviden:</strong></p>
<p>Ezen a héten egy <strong>élőlényekről készült fotót</strong> várunk tőled. <PhotoUploadLink label="Itt tudod feltölteni" />.</p>
<p><strong>Hosszabban:</strong></p>
<FullWidthLocalImage fileName="jellyfish.jpg" altText="Medúza." />
<p>A múlt héten egészen sok elméletet vettünk. Most lazítunk egy kicsit, csak a fókuszáláshoz adunk pár egyszerű tippet. 😊</p>


<p>A legjobb képedet ${formattedDeadline}-ig, <PhotoUploadLink label="itt tudod feltölteni" />. (Megjegyzés: időről időre előfordul, hogy valaki egynél több képet küld be egy héten. Az igazságosság jegyében – hogy legyen lehetőséged javítani, de ne osszunk meg egy embertől több képet – ilyenkor a legutoljára beküldött képet szoktuk betenni a galériába.)</p>


<p>Ha még nem küldted be a múlt heti (mozgásos) képedet, ma éjfélig még azt is <PhotoUploadLink label="megteheted" />. 🕚</p>
<p>Az élőlényeket pedig még egyszer, <PhotoUploadLink label="itt" /> várjuk!</p>
<p>Jó fotózást,</p>
<p>--<br />
    a Photato csapata</p>
</>;
}