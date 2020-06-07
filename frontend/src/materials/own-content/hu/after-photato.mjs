import React from '../../../web_modules/react.js';
import ExternalLink from '../../components/ExternalLink.mjs';
import {config} from '../../../config.mjs';

// noinspection JSUnusedGlobalSymbols (This file is loaded dynamically.)
/**
 * @returns {ArticleMetadata}
 */
export function getMetadata() {
    // noinspection SpellCheckingInspection (It's in Hungarian.)
    return {
        slug: 'after-photato',
        title: 'Hogyan tovább a Photato után?',
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
        <p>Úgy gondoljuk, ha tetszett ez a 12 hetes tanfolyam, talán szívesen folytatnád a tanulást (most vagy később) hasonló napi/heti kihívásokkal és kurzusokkal. Összeszedtünk neked néhányat a legjobbak közül, viszont sajnos nem találtunk másik magyar nyelvű ingyenes tanfolyamot, így ezek mind vagy fizetősek, vagy angol nyelvűek – de mind színvonalasak. Reméljük, ha folytatnád a tanulást, találsz közülük szimpatikusat.</p>
        <h2>Napi/heti kihívások</h2>
        <ul>
            <li><ExternalLink href="https://www.flickr.com/groups/365days/">365 önarckép</ExternalLink> (angol) – egy kis közösség, akik minden nap beküldenek egy önarcképet.</li>
            <li><ExternalLink href="https://www.techradar.com/how-to/52-photography-projects-a-great-technique-to-try-every-week-of-the-year">52 heti fotóötlet</ExternalLink> (angol, de képekkel) – ha a Photato koncepcióját folytatnád.</li>
            <li><ExternalLink href="https://digital-photography-school.com/7-photography-projects-to-jumpstart-your-creativity/">7 projekt-ötlet</ExternalLink> (angol) – 7 további ötlet: napi önarckép; heti fotós séta; 100 fotó ismeretlen emberekről; egy fotó az abc minden betűjére (a „Q” egész trükkös lehet); sok fotó egy témáról; napi fekete-fehér fotó egy hónapig; listaírás és végigfotózás.</li>
        </ul>

        <h2>Tanfolyamok</h2>
        <ul>
            <li><ExternalLink href="https://www.onlinefototanfolyam.hu/">Online fotótanfolyam</ExternalLink> (magyar, 19.900 ft) – A 67 leckéből az első 5 ingyen van, így ingyen megnézheted, tetszik-e.</li>
            <li><ExternalLink href="https://fotozasblog.hu/">Fotózás lépésről lépésre</ExternalLink> (magyar, 4.500 ft) – Egy blog, leírásokkal és magyarázatokkal, melyeknek egy része ingyenes, más része egy online megvásárolható digitális könyvben elérhető.</li>
            <li><ExternalLink href="https://digital-photography-school.com/">Digital Photography School</ExternalLink> (angol) – Fotós suli heti tippekkel és hasznos cikkekkel kezdőtől profi szintig.</li>
            <li><ExternalLink href="https://gurushots.com/">Gurushots</ExternalLink> (angol) – Szépen felépített, játékos oldal folyamatos kihívásokkal és akár pénzdíjas versenyekkel.</li>
        </ul>

        <h2>A Photato-n belüli lehetőségek</h2>
        <ul>
            <li><strong>Iratkozz be a következő tanfolyamra.</strong> A feladatok várhatóan ugyanezek lesznek, de a visszajelzések alapján alakulni, javulni szokott a tanfolyam. Az a tapasztalatunk, hogy második nekifutásra sokaknak jobban átjön, beivódik az elmélet, míg mások sikeresebben szánnak időt a gyakorlásra másodszorra. Vagy beadhatod a feladatokat, amikre most nem jutott időd. Ha jönnél, <ExternalLink href={config.course.signUpFormUrl}>jelentkezz itt</ExternalLink>.</li>
            <li><strong>Csatlakozz mentorként.</strong> A többiek fotóit véleményezve még rengeteget tanulhatsz, ráadásul nagyon sokat segítesz nekik ezzel. Nem kell profinak lenned. Ha tudsz kedves visszajelzéseket írni az embereknek, az elég. Akár egy üres emailben jelentkezhetsz itt és most: <a href="mailto:photatophotato@gmail.com?subject=Érdekel a mentorság">photatophotato@gmail.com</a>.</li>
            <li><strong>Segíts nekünk az angol fordításban.</strong> Ha jól tudsz angolul és jó a helyesírásod, és elmélyítenéd a tudásod az elméleti anyagban, segíts nekünk 1–2 cikk lefordításában. Sokat tanulsz, és segítesz vele nekünk. Ha érdekel ez a lehetőség, itt tudsz szólni nekünk róla, akár egy egy soros emailben: <a href="mailto:photatophotato@gmail.com?subject=Angol fordításban segítenék">photatophotato@gmail.com</a>.</li>
        </ul>
    </>;
}
