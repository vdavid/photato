import React from 'react';
import ExternalLink from '../../components/ExternalLink.jsx';
import FullWidthLocalImage from '../../../challenges/components/FullWidthLocalImage.jsx';
import {NavLink} from 'react-router-dom';
import PhotatoEmoji from '../../../website/components/PhotatoEmoji.jsx';

// noinspection JSUnusedGlobalSymbols (This file is loaded dynamically.)
/**
 * @returns {ArticleMetadata}
 */
export function getMetadata() {
    // noinspection SpellCheckingInspection (It's in Hungarian.)
    return {
        slug: 'week2-building-photography',
        title: 'Épületfotózás tippek',
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
        <ol>
            <li><strong>Nézz körül.</strong> Figyeld meg a környezeted. A legtöbben nem vesszük észre, milyen király épületek mellett megyünk el mindennap. Nézz magasabbra, mint szoktál!</li>
            <li><strong>Tanulj egy kis elméletet.</strong> Ha tisztában vagy a fényképezés alapjaival, sokkal több lehetőséged lesz érdekes képeket csinálni. Különösen, ha fényképezőgépet használsz, vagy van profi kamera alkalmazás a telefonodon (Camera FV-5 Androidra – <ExternalLink href="https://play.google.com/store/apps/details?id=com.flavionet.android.camera.lite">0ft</ExternalLink> / <ExternalLink href="https://play.google.com/store/apps/details?id=com.flavionet.android.camera.pro">899ft</ExternalLink>, <ExternalLink href="https://apps.apple.com/us/app/procam-7/id730712409">ProCam 7 iOS-re</ExternalLink> – 2290ft).<br />Remek kiindulópont ez a 10 perces cikk, érdemes elolvasni: <ExternalLink href="https://fotozasblog.hu/digitalis-fotozas/">Fotózás alapok: zoom, blende, záridő</ExternalLink>.</li>
            <li><strong>Menj messzebb.</strong> Ha a teljes épületet akarod fotózni, figyelj rá, hogy valóban az egész épület beleférjen a képbe. Ha <ExternalLink href="https://fotozasblog.hu/digitalis-fotozas/#optikaizoom">nagy látószögű</ExternalLink> optikád van, könnyű a dolgod, de ha nincs, érdemes hátrébb menni.</li>
            <li><strong>Keresd meg a nézőpontod.</strong> Sétálj körbe, találd meg a magasságot. Nézz körül, honnan fotózhatsz még, ami nem magától értetődő: szomszédos épületről, távolról rázoomolva stb.</li>
            <li><strong>Állítsd be a kamerád.</strong> Ha kell, használj szűkebb <ExternalLink href="https://fotozasblog.hu/digitalis-fotozas/#melysegelesseg">blende</ExternalLink> beállítást, hogy nagyobb legyen az éles tartomány. Itt egy gif a mélységélességről: <FullWidthLocalImage fileName="depth-of-field.gif" altText="Mélységélesség" />.</li>
            <li><strong>Figyelj a kontextusra.</strong> Keretezd a kompozíciót más épületekkel, tárgyakkal. Ha emberek, autók vannak az épület körül, légy türelmes és várd meg, amíg elmennek, vagy fogadd el és használd őket, pl. a méretek érzékeltetésére.</li>
            <li><strong>Este használj állványt.</strong> Ha este/éjszaka fotóznál, használj állványt, vagy tedd le egy stabil helyre a gépet. Ha nincs állványod, jó trükk tud lenni egy pulcsira/sálra tenni a géped, és úgy beállítani. Telefonnal ez eggyel nehezebb, de egy idő után mindig sikerül megoldani. 😊</li>
        </ol>

        <p>Variációk:</p>
        <ul>
            <li><strong>Zoomolj rá.</strong> Keress izgalmas kivágásokat, ahol érdekes a geometria vagy épületszobrászat. Ha menő, cserélhető objektíves géped van, használj a nagy látószögű lencse mellett teleobjektívet, vagy csak zoomolj rá a részletekre.</li>
            <li><strong>Menj be.</strong> És nézz körül. Sok épület belül is tartogat jól fotózható meglepetéseket.</li>
            <li><strong>Játssz az idővel.</strong> Fotózd le ugyanazt az épületet különböző időpontokban és időjárásban: hajnalban, reggel, délelőtt, délután, napnyugtakor, este. Napsütésben, esőben, havazásban (irány Norvégia! 😉), felhős ég alatt. Figyeld meg, hogy mikor mennyire kontrasztos, színekben gazdag, drámai a kép. Egy rossz időben készült fotónak is lehet érdekes hangulata. Ha nagyon színtelen a kép, készíts fekete-fehér fotókat. Délben nincs sok árnyék és hideg a fény. Állítsd be a fehéregyensúlyt az időnek megfelelően. (A fehéregyensúlyról majd még tanulunk később, de érdeklődőknek <ExternalLink href="https://fotozasblog.hu/feher-egyensuly-beallitas-viszlat-sarga-fotok/">itt egy cikk elöljáróban</ExternalLink>.)</li>
            <li><strong>Tükrözz.</strong> Használd ki a környezet felületeit: keress tükröződéseket egy pocsolyán vagy egy üvegfelületen</li>
            <li><strong>Szűrj.</strong> Ha profi fotócuccod van, próbálj ki egy sötét szűrőt, hogy nappal is hosszabb záridővel fotózhass és elmosódjanak az emberek.</li>
            <li><strong>Omolj.</strong> Fotózz omladozó, pusztuló épületeket, gyárakat.</li>
            <li><strong>Plankelj.</strong> Milliószor ugyanúgy lefotózott híres épületek? Feküdj be a képbe: <FullWidthLocalImage fileName="washington.jpg" altText="Fehér ház" /></li>
        </ul>

        <p>Linkek:</p>
        <ul>
            <li>A legjobban a fentebb is linkelt <ExternalLink href="https://fotozasblog.hu/digitalis-fotozas/">fotózás alapok: zoom, blende, záridő</ExternalLink> cikket ajánljuk.</li>
            <li>További <ExternalLink href="https://sg.hu/cikkek/it-tech/43737/hogyan-fotozzunk-varosok-megorokitese">tippek városi fotózáshoz</ExternalLink> az sg.hu-n. [<NavLink to={'/hu/external-article/sg-varosok-megorokitese'}><PhotatoEmoji /> mentett verzió</NavLink>]</li>
            <li>Még <ExternalLink href="https://www.canon.hu/get-inspired/tips-and-techniques/city-photography/">tippek városi fotózáshoz</ExternalLink> a Canontól.</li>
        </ul>

        <p>Inspiráció: <ExternalLink href="https://hu.pinterest.com/search/pins/?q=building%20photography">Pinterest</ExternalLink>
            | <ExternalLink href="https://hu.pinterest.com/search/pins/?q=budapest%20buildings">Pinterest / Budapest</ExternalLink>
            | Mobile Photo Awards épületfotó győztesek: <ExternalLink href="https://mobilephotoawards.com/architecture-design-winners-8th-annual-mpa/">2018</ExternalLink>
            | <ExternalLink href="https://mobilephotoawards.com/architecture-design-winner-honorable-mentions-7th-annual-mpa/">2017</ExternalLink>
            | <ExternalLink href="https://mobilephotoawards.com/architecture-design-winner-honorable-mentions-6th-mpa/">2016</ExternalLink>
            | <ExternalLink href="https://mobilephotoawards.com/architecture-design/">2015</ExternalLink>
            | <ExternalLink href="https://mobilephotoawards.com/architecture-design-2014-mpa-results/">2014</ExternalLink>
            | <ExternalLink href="https://mobilephotoawards.com/2013-mobile-photography-awards-architecturedesign-category-winners/">2013</ExternalLink></p>
    </>;
}