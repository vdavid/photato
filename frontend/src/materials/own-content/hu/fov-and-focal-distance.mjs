import React from '../../../web_modules/react.js';
import FullWidthLocalImage from '../../../challenges/components/FullWidthLocalImage.mjs';
import {config} from '../../../config.mjs';

// noinspection JSUnusedGlobalSymbols (This file is loaded dynamically.)
/**
 * @returns {ArticleMetadata}
 */
export function getMetadata() {
    // noinspection SpellCheckingInspection (It's in Hungarian.)
    return {
        slug: 'fov-and-focal-distance',
        title: 'Látószög, gyújtótávolság',
        author: 'Photato',
        publishDate: new Date('2020-06-07'),
        publisherName: 'Photato',
    };
}

// noinspection JSUnusedGlobalSymbols (This file is loaded dynamically.)
/**
 * @returns {React.ReactElement}
 */
export default function Article() {
    // noinspection SpellCheckingInspection (It's in Hungarian.)
    return <>
        <p><strong>Egy kis elmélet azoknak, akik fényképezőgéppel fotóznak, meg akiket érdekel:</strong></p>
        <p>Volt már szó futólag a látószögről és a gyújtótávolságról. Előbbit fokban, utóbbit milliméterben mérjük, és itt van egy elég beszédes illusztráció arról, hogy hogyan függenek össze:</p>
        <FullWidthLocalImage fileName="fov-and-focal-distance.jpg" alt="Látószög és gyújtótávolság" />.
        <p>Most röviden megnézzük, mit jelentenek ezek a gyakorlatban, portréknál.</p>
        <p>A legfontosabb, hogy az objektív a látószögétől függően torzítja a testet, az arcot. Ez jelenik meg, amikor “kövérít” a kamera, vagy viccesen megnöveli az orrot. Itt egy kép, amin 16mm és 200mm között változik a beállított gyújtótávolság:</p>

        <FullWidthLocalImage fileName="16mm-200mm.gif" altText="16mm-200mm" />

        <p>Figyeld meg, hogy ahogy csökken a gyújtótávolság (egészen 16mm-ig), egyre többet látsz a kissrác környezetéből, viszont egyre torzabb a feje és nagyobb az orra. A másik irányban, a 200mm-es végén viszont már kb. semmit nem látsz a mögötte lévő térből, a srác feje pedig kilapul.</p>
        <p>Itt egy másik, stúdióban készült képsorozat is:</p>

        <FullWidthLocalImage fileName="20mm-200mm.gif" altText="20mm-200mm" />

        <p>Ugyanez állóképként, 20-85mm-ig:</p>

        <FullWidthLocalImage fileName="fov-portrait.png" altText="Látószög portrénál" />

        <p>Na de hány mm-es beállítás a leghűebb a valósághoz? Erre sajnos nincs egyértelmű válaszunk, mert ez a gépedben lévő érzékelő méretétől függ.</p>
        <p>Volt régen a hagyományos, “analóg”, filmes gép. Hosszú ideig az volt a szabvány méret, amekkorában ezek a fényképezőgépek a képet (negatívot) készítették. Ezt hívják “full frame”-nek, azaz teljes méretű képnek. Egy full frame-es gépnél az <strong>50mm-es</strong> gyújtótávolság a leghűebb a valósághoz, mert ez felel meg legjobban az emberi szem látószögéhez. Tehát ha a géped full frame-es, akkor 50mm-es objektívvel a legszerencsésebb portrét fotóznod.</p>
        <p>Egy full frame-es gép viszont elég drága, a te géped érzékelője nagy valószínűséggel ennél kisebb. Itt van néhány tipikus érzékelő-méret:</p>

        <FullWidthLocalImage fileName="sensor-sizes.jpg" altText="Érzékelők" />

        <p>A képen a zöld a full frame, a sárga a legtöbb tükörreflexes gép érzékelő-mérete, a piros is gyakori a közepes gépeknél, a két kék pedig a tipikus kompakt kamerák ill. az iPhone 6 szenzormérete.</p>
        <p>Ha tudni akarod, hogy a te gépednél mi az emberi szemnek leginkább megfelelő zoom-beállítás, keresd ki a géped érzékelőjének méretét a gép használati utasításában vagy az interneten, aztán keresd ki az érzékelő-méretednek megfelelő oszlopot az alábbi táblázatban, és nézd meg a “Normal” sorban lévő értéket. Ezzel a gyújtótávolság-beállítással lesz a legtermészetesebb a portréd.</p>
        <FullWidthLocalImage fileName="sensor-size-table.jpg" altText="Szenzorméret táblázat" />

        <p>Most, hogy ezt a cikket elolvastad, ajánljuk az <a href={config.baseUrl + '/hu/article/week9-portrait'}>Portréfotózás tippek</a>et a gyakorláshoz.</p>
    </>;
}
