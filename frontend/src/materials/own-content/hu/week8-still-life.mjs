import React from '../../../web_modules/react.js';
import ExternalLink from '../../components/ExternalLink.mjs';

// noinspection JSUnusedGlobalSymbols (This file is loaded dynamically.)
/**
 * @returns {ArticleMetadata}
 */
export function getMetadata() {
    // noinspection SpellCheckingInspection (It's in Hungarian.)
    return {
        slug: 'csendelet-tippek',
        title: 'Csendélet-fotózás tippek',
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
        <!-- TODO: Add link here! (white balance) -->

        <p><strong>Néhány tipp a csendélethez</strong></p>
        <p>A csendélet igen komplex feladat tud lenni, de egyben kellemesen ráérős is, mert a fotómodellek garantáltan nem tűnnek/másznak/fáradnak el. A tippek:</p>
        <ol>
            <li><strong>Válaszd ki a témát.</strong> Mi az, ami érdekes neked, és miért? Mit akarsz mondani a képpel? Lehet, hogy rögtön rátalálsz a témádra a lakásodban vagy az utcán. De lehet, hogy keresgélned kell, vagy akár szobrászkodnod, barkácsolnod, festened érdemes hozzá.</li>
            <li><strong>Készítsd elő a környezetet.</strong> Ügyelj rá, hogy ne vonja el a figyelmet a háttér. Pakolj el, esetleg helyezd a tárgyakat papírra vagy semleges színű szövetre. Játssz a színekkel vagy éppen fogd vissza őket, hogy ne zavarják a fő témád.</li>
            <li><strong>Képezz fényt – fényképezz.</strong> Az épületfotók, utcai képek és sportfotók után most végre teljes kontrollod van a megvilágítás felett! Fontos, hogy egyféle fényforrást használj: ha többfélét használsz egyszerre, nem tudod majd beállítani a megfelelő fehéregyensúlyt. Használhatsz természetes szórt fényt, direkt napfényt, derítő lapot (egy nagy világos felület, ami ráveti a fényt a tárgy árnyékos oldalára – ld. tepsi+alufólia tipp még az első hétről). Használhatsz lámpákat is, de figyelj arra, hogy egyféle izzó legyen bennük. Egy LED izzónak nagyon más a színhőmérséklete, mint egy neon fénycsőnek.</li>
            <li><strong>Komponálj.</strong> Gondolj a harmadolási szabályra, de ne erőltesd rá mindenre. A különböző komponálási technikákról <ExternalLink href="https://tisztaegtisztafold.hu/komponalas-geometria/">itt olvashatsz</ExternalLink>.</li>
            <li><strong>Exponálj helyesen.</strong> Gondolj az előző hetekben tanultakra. Ha kevés a fény, a gépnek több idő kell a helyes exponáláshoz. Ilyenkor használj állványt és ha kell, 2 másodperces időzítőt. Figyelj rá, hogy alacsony ISO értéket használj, hogy ne legyen szemcsés a kép.</li>
            <li><strong>Végezz utómunkát.</strong> Ez nem kötelező, ráadásul egy elég komplex téma, megérdemelne egy külön tanfolyamot. Ha szívesen kísérleteznél, ajánlunk azért néhány programot, amiket érdemes kipróbálnod:
                <ul>
                    <li><ExternalLink href="https://pixlr.com/editor/">Pixlr</ExternalLink> (ingyenes, online),</li>
                    <li><ExternalLink href="https://www.gimp.org/">Gimp</ExternalLink> (ingyenes, letölthető),</li>
                    <li><ExternalLink href="https://affinity.serif.com/en-gb/photo/">Affinity Photo</ExternalLink> (18e ft, letölthető),</li>
                    <li>Adobe <ExternalLink href="https://www.adobe.com/hu/products/photoshop.html">Photoshop</ExternalLink> és <ExternalLink href="https://www.adobe.com/hu/products/photoshop-lightroom.html">Lightroom</ExternalLink> (drágák).</li>
                </ul>
            </li>
        </ol>
        <p><strong>Linkek további infókra, tippekre</strong></p>
        <ul>
            <li>10 remek tipp <ExternalLink href="https://photography.tutsplus.com/hu/tutorials/10-tips-to-get-started-with-still-life-photography--photo-8278">a csendélet-fotózás elkezdéséhez</ExternalLink></li>
            <li>A komponálási technikákról: <ExternalLink href="https://tisztaegtisztafold.hu/komponalas-geometria/">6 komponálási és geometriai tipp</ExternalLink></li>
        </ul>
        <p><strong>Ötletek, variációk</strong></p>
        <ul>
            <li>Gyűjtemények: <ExternalLink href="https://hu.pinterest.com/pin/424464333613794639/">egyszínű dolgok</ExternalLink>, egy témához kapcsolódó tárgyak összerendezve</li>
            <li><ExternalLink href="https://hu.pinterest.com/pin/439171401157788730/">Lebegő tárgyak</ExternalLink></li>
        </ul>
        <p><strong>Inspiráció:</strong> <ExternalLink href="https://hu.pinterest.com/search/pins/?q=still%20life%20photography">Pinterest csendéletek</ExternalLink> | <ExternalLink href="https://www.pexels.com/search/still%20life/">Pexels</ExternalLink> | Mobile Photo Awards épületfotó győztesek: <ExternalLink href="https://mobilephotoawards.com/3rd-annual-mobile-photography-awards-winners-honorable-mentions/">2013</ExternalLink> | <ExternalLink href="https://mobilephotoawards.com/still-life-2014-mpa-results/">2014</ExternalLink> <ExternalLink href="https://mobilephotoawards.com/still-life/">2015</ExternalLink> | <ExternalLink href="https://mobilephotoawards.com/still-life-winner-honorable-mentions-6th-annual-mpa/">2016</ExternalLink> | <ExternalLink href="https://mobilephotoawards.com/still-life-winner-honorable-mentions-7th-annual-mpa/">2017</ExternalLink></p>
    </>;
}