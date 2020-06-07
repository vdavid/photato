import React from '../../../web_modules/react.js';
import FullWidthLocalImage from '../../../challenges/components/FullWidthLocalImage.mjs';
import ExternalLink from '../../components/ExternalLink.mjs';
import {config} from '../../../config.mjs';

// noinspection JSUnusedGlobalSymbols (This file is loaded dynamically.)
/**
 * @returns {ArticleMetadata}
 */
export function getMetadata() {
    // noinspection SpellCheckingInspection (It's in Hungarian.)
    return {
        slug: 'aperture-shutter-iso',
        title: 'Blende, záridő, és ISO érték',
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
        <FullWidthLocalImage fileName="biker.jpg" altText="Motoros" />

        <p>Valószínűleg sokszor tapasztaltad már, hogy amikor gyorsan le akarsz kapni valamit (pl. sportrendezvény, koncert, gyerekek/állatok fotózása, autóból kifényképezés), a képek gyakran elmosódottak lesznek. Ez azért van, mert az alatt az idő alatt, amíg a fénykép készül – tehát amíg a kamera rekesze nyitva van – elmozdul a fotótéma. Ezen a héten azt fogjuk gyakorolni, hogy hogyan lehet ezt minél inkább elkerülni, és szép, éles képeket készíteni ezekben a helyzetekben.</p>

        <p><strong>Fontos infó a mobillal fotózóknak:</strong> Igazi jó megoldást fényképezőgéphez fogunk adni. Ha elsősorban mobillal fotózol, esetleg érdemes lehet most keresni/kölcsönkérni egy fényképezőgépet, mert ezen a héten sok fotós trükköt tanulhatsz. Ha inkább maradnál a mobilnál, akkor vagy olvass tovább annak tudatában, hogy nem mindent fogsz tudni most azonnal hasznosítani, vagy ugorj a levél aljára, ahol általánosabb tippeket adunk az e heti feladathoz.</p>

        <p><strong>Egy kis elmélet, fényképezőgéphez:</strong></p>

        <p>Szóval elmosódott képek. A megoldás a fényképezőgép beállításai között lesz. Ezen a héten megismerjük a három legfontosabb beállítást: a blendét, záridőt és ISO értéket ezen a héten fogjuk megtanulni.</p>

        <ul>
            <li><strong>blende</strong> (aperture): mennyire legyen tág/szűk a fényképezőgép nyílása, amin az érzékelőre jut a fény.</li>
            <li><strong>záridő</strong> (shutter speed): mennyi ideig legyen nyitva a fényképezőgép nyílása.</li>
            <li><strong>ISO érték</strong>: mennyire legyen érzékeny a kamera fényérzékelője.</li>
        </ul>

        <p>Itt egy ábra is ezekről. A felső 2 sorban a <strong>blende</strong> és a vele járó mélységélesség, alatta a <strong>záridő</strong>, alul pedig az <strong>ISO érték</strong>:</p>

        <FullWidthLocalImage fileName="settings.jpg" altText="Beállítások" />

        <p>Ha a képre nézve az volt az első gondolatod, hogy “fú, ez bonyolultnak néz ki”, akkor jó hírünk van: ha rászánsz most egy kis időt, pár perc múlva már nem lesz ijesztő ez a kép. 😊 Ezt a 3-4 dolgot csináld meg:</p>

        <ol>
            <li>Tölts el egy percet a fenti képpel. Nézd meg, mit írtunk róla fentebb (blende, záridő, ISO érték). Keresd meg a kép 3 részét, és gondolkozz egy picit, mit ábrázolhatnak.</li>
            <li>Olvasd el a <ExternalLink href="https://fotozasblog.hu/digitalis-fotozas/">Fotózás alapjai</ExternalLink> cikk “Rekesz, blende, rekeszérték” és “Záridő” részeit. Ha van rá időd, fusd át a "Mélységélesség" részt is. Ez után nézd meg a fenti képet újra. Az első két sor a mélységélességet és a blendét illusztrálja, a harmadik sor pedig a záridőt.</li>
            <li>Olvasd el a cikk <ExternalLink href="https://fotozasblog.hu/fotozas-alapjai-iso-fenymeres/">második részének</ExternalLink> “ISO érzékenység” részét. Aztán nézd meg újra a fenti kép utolsó sorát, ami az ISO érzékenységet illusztrálja.</li>
            <li>(Opcionális) Ha beszélsz valamennyire angolul és szívesen tanulsz videóból, jó szívvel ajánljuk <ExternalLink href="https://www.youtube.com/watch?v=F8T94sdiNjc">Tony Northrup 15 perces videóját</ExternalLink>, amiben még egyszer elmagyarázza ezeket. A cikkekből és a videóból nagyon stabilan meg fogod érteni, hogy mik ezek a beállítások. Nézd meg még egyszer a fenti képet. Így már nem ijesztő, ugye? 😊</li>
        </ol>

        <p><strong>Gyakorlás fényképezőgéppel:</strong></p>

        <ul>
            <li><strong>Manuális mód:</strong> Állítsd a fényképezőgéped manuális (“M”) üzemmódba. Ez nem minden gépen egyértelmű, pedig általában csak egy gombnyomásra van a beállítás. Próbálkozz bátran, mindjárt meglesz!</li>
            <li><strong>Blende:</strong> Próbálgasd egyesével beállítani az értékeket. Figyeld meg, hogy ahogy növeled a blende értéket (szűkíted a blendét), egyre sötétedik a kép, de nő a mélységélesség: a közeli és távoli dolgok egyaránt élesek lesznek.</li>
            <li><strong>Záridő:</strong> Figyeld meg, hogy ahogy növeled a záridőt, egyre világosodik a kép, de egyre könnyebben bemozdul a fotó, pl. a kezed remegésétől.</li>
            <li><strong>ISO érték:</strong> Figyeld meg, hogy ahogy növeled az ISO értéket, egyre világosodik, de zajosodik a kép.</li>
        </ul>

        <FullWidthLocalImage fileName="horse.jpg" altText="Ló." />

        <p>Most, hogy ezt a cikket elolvastad, ajánljuk a <a href={config.baseUrl + '/hu/article/week5-sports-photos'}>Sportfotó tippek</a>et a gyakorláshoz.</p>
    </>;
}
