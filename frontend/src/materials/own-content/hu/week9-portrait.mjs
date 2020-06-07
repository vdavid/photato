import React from '../../../web_modules/react.js';
import ExternalLink from '../../components/ExternalLink.mjs';
import FullWidthLocalImage from '../../../challenges/components/FullWidthLocalImage.mjs';
import {config} from '../../../config.mjs';

// noinspection JSUnusedGlobalSymbols (This file is loaded dynamically.)
/**
 * @returns {ArticleMetadata}
 */
export function getMetadata() {
    // noinspection SpellCheckingInspection (It's in Hungarian.)
    return {
        slug: 'portrefotozas-tippek',
        title: 'Portréfotózás tippek',
        author: 'Photato',
        publishDate: new Date('2020-06-07'),
        publisherName: 'Photato',
        unlockWeekIndex: 9,
    };
}

// noinspection JSUnusedGlobalSymbols (This file is loaded dynamically.)
/**
 * @returns {React.ReactElement}
 */
export default function Article() {
    // noinspection SpellCheckingInspection (It's in Hungarian.)
    return <>
        <p><strong>Tipp:</strong> Mielőtt elkezdesz dolgozni a portréidon, ajánljuk elolvasásra a <a href={config.baseUrl + '/article/latoszog-gyujtotavolsag'}>Látószög, gyújtótávolság</a> cikkünket, hogy biztosan jó objektívet használ, és ne legyen senkinek a valóságosnál nagyobb orra vagy laposabb arca a képeiden. 😊</p>

        <p><strong>Néhány praktikus tanács portréfotózáshoz:</strong></p>
        <ol>
            <li><strong>Válassz helyszínt.</strong> Zárt térben, mesterséges fénynél van a legtöbb lehetőséged beállítani a képet, de végső soron a kreativitásodra (és gyakran a véletlenre) van bízva, hogy hol fotózol.</li>
            <li><strong>Világíts. </strong>Kerüld a direkt napfényt. Helyette használj szórt fényt, az árnyékos oldalak megvilágítására pedig derítőlapot (megint a tepsis trükk).</li>
            <li><strong>Komponálj.</strong> Te döntöd el, hogy csak a modelled arca legyen a képen, vagy az arca és felsőteste, esetleg az egész alakja. Ha több látszik a környezetből, az elvonhatja a figyelmet, de hozzá is adhat a portréhoz. Ez rád van bízva, nincs objektíve jó megoldás.</li>
            <li><strong>Zoomolj.</strong> Ld. az elméleti részt feljebb. Találd meg a megfelelő objektívet (ha több van), zoom-beállítást és távolságot, hogy minél kevesebb torzítással kapd le a modelled.</li>
            <li><strong>Fókuszálj.</strong> A legtöbb esetben az a nyerő beállítás, ha a modell szeme éles, mert a szem a legkifejezőbb része az arcnak. Ügyelj, hogy pontosan fókuszálj.</li>
            <li><strong>Instruálj.</strong> Segíts a modellednek a megfelelő pózba állni, jó irányba nézni stb. Próbálkozz szemből, profilból, enyhén oldalról stb. Kísérletezz.</li>
            <li><strong>Élvezd.</strong> Oldd a hangulatot, hogy fesztelen és őszinte legyen a modell. Beszélgessetek, légy közvetlen, barátságos. 😊</li>
        </ol>
        <FullWidthLocalImage fileName="body-painting.jpg" altText="Testfestés" />
        <p><strong>Variációk, érdekességek:</strong></p>
        <ul>
            <li>Fesd össze a modelled.</li>
            <li>Photoshoppolj. <ExternalLink href="https://www.behance.net/gallery/32763127/Animeyed-(Self-Portraits)">Borsi Flóra állatos önarcképei</ExternalLink></li>
        </ul>
        <p><strong>Linkek:</strong></p>
        <ul>
            <li><ExternalLink href="http://blog.fotosarok.hu/tag/101-portrefoto-tipp/page/2/">101 portréfotó tipp</ExternalLink> – a Fotósarok Blog 5 részes cikksorozata</li>
            <li><ExternalLink href="https://sg.hu/cikkek/it-tech/45404/hogyan-fotozzunk-emberek-portrek">Hogyan fotózzunk - emberek, portrék</ExternalLink> – az sg.hu cikke a protréfotózásról</li>
            <li><ExternalLink href="https://fotosuli.blog.hu/2016/08/03/hogyan_keszitsunk_szep_portrefotot">Hogyan készítsünk szép portréfotót?</ExternalLink> – a fotosuli.hu rövid cikke</li>
            <li><ExternalLink href="https://www.fotobetyar.hu/interaktivanyagok/objektivek-jellemzoi-gyujtotavolsag/">Objektívek, gyújtótávolság, látószög, érzékelő-méretek</ExternalLink> – remek elméleti összefoglaló a fotobetyar.hu-tól</li>
            <li><ExternalLink href="https://www.onlinefototanfolyam.hu/aktualis-cikkek/mi-a-gyujtotavolsag-szorzo-/47545/">Mi a gyújtótávolság-szorzó?</ExternalLink> – további elmélet a onlinefototanfolyam.hu-n</li>
        </ul>
        <p><strong>Inspiráció:</strong> <ExternalLink href="https://hu.pinterest.com/search/pins/?q=portrait%20photography">Pinterest</ExternalLink>
            | <ExternalLink href="https://www.boredpanda.com/top-10-photographers-for-travel-portraits/">Bored Panda</ExternalLink>
            | <ExternalLink href="https://filtergrade.com/best-portrait-photographers-to-inspire-you/">Filtergrade</ExternalLink> | Mobile Photography Awards <ExternalLink href="https://mobilephotoawards.com/portraits/">2015</ExternalLink>
            | <ExternalLink href="https://mobilephotoawards.com/portraits-winner-honorable-mentions-6th-annual-mpa/">2016</ExternalLink>
            | <ExternalLink href="https://mobilephotoawards.com/portraits-winner-honorable-mentions-7th-annual-mpa/">2017</ExternalLink></p>
    </>;
}