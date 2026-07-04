import React from '../../../web_modules/react.js';
import {config} from '../../../config.mjs';
import PhotoUploadLink from '../../components/PhotoUploadLink.mjs';
import ExternalLink from '../../../materials/components/ExternalLink.mjs';

// noinspection JSUnusedGlobalSymbols (It's imported dynamically.)
/**
 * @param {string} formattedDeadline
 * @returns {React.ReactElement}
 */
export default function Week12Challenge({formattedDeadline}) {
    return <>
        <p><strong>Röviden:</strong>
        </p>
        <ul>
            <li>Ezen a héten a legjobb <strong><em>bármilyen</em></strong> képedet várjuk tőled. <PhotoUploadLink label="Itt tudod majd feltölteni" />, ${formattedDeadline}-ig.</li>
            <li>Mindjárt vége a tanfolyamnak, de adunk pár ötletet a folytatáshoz.</li>
            <li>Hamarosan indul a következő kurzus, ajánld azoknak, akik örülnének neki.</li>
        </ul>
        <p><strong>Hosszabban:</strong></p>


        <p>A legjobb képedet ${formattedDeadline}-ig, <PhotoUploadLink label="itt tudod majd feltölteni" />.</p>
        <p><strong>Arról, hogy hogyan folytasd a tanulást:</strong>
        </p>
        <p>Úgy gondoljuk, ha tetszett ez a 12 hetes tanfolyam, talán szívesen folytatnád a tanulást (most vagy később) hasonló napi/heti kihívásokkal és kurzusokkal. Összeszedtünk neked néhányat a legjobbak közül, viszont sajnos nem találtunk másik magyar nyelvű ingyenes tanfolyamot, így ezek mind vagy fizetősek, vagy angol nyelvűek – de mind színvonalasak. Reméljük, ha folytatnád a tanulást, találsz közülük szimpatikusat.</p>
        <p>Napi/heti kihívások:</p>
        <ul>
            <li><ExternalLink href="https://www.flickr.com/groups/365days/">365 önarckép</ExternalLink> (angol) – egy kis közösség, akik minden nap beküldenek egy önarcképet.</li>
            <li><ExternalLink href="https://www.techradar.com/how-to/52-photography-projects-a-great-technique-to-try-every-week-of-the-year">52 heti fotóötlet</ExternalLink> (angol, de képekkel) – ha a Photato koncepcióját folytatnád.</li>
            <li><ExternalLink href="https://digital-photography-school.com/7-photography-projects-to-jumpstart-your-creativity/">7 projekt-ötlet</ExternalLink> (angol) – 7 további ötlet: napi önarckép; heti fotós séta; 100 fotó ismeretlen emberekről; egy fotó az abc minden betűjére (a „Q” egész trükkös lehet); sok fotó egy témáról; napi fekete-fehér fotó egy hónapig; listaírás és végigfotózás.</li>
        </ul>
        <p>Tanfolyamok:</p>
        <ul>
            <li><ExternalLink href="https://www.onlinefototanfolyam.hu/">Online fotótanfolyam</ExternalLink> (magyar, 19.900 ft) – A 67 leckéből az első 5 ingyen van, így ingyen megnézheted, tetszik-e.</li>
            <li><ExternalLink href="https://fotozasblog.hu/">Fotózás lépésről lépésre</ExternalLink> (magyar, 4.500 ft) – Egy blog, leírásokkal és magyarázatokkal, melyeknek egy része ingyenes, más része egy online megvásárolható digitális könyvben elérhető.</li>
            <li><ExternalLink href="https://digital-photography-school.com/">Digital Photography School</ExternalLink> (angol) – Fotós suli heti tippekkel és hasznos cikkekkel kezdőtől profi szintig.</li>
            <li><ExternalLink href="https://gurushots.com/">Gurushots</ExternalLink> (angol) – Szépen felépített, játékos oldal folyamatos kihívásokkal és akár pénzdíjas versenyekkel.</li>
        </ul>
        <p><strong>A Photatoról:</strong>
        </p>
        <p>Köszi, hogy részt vettél a tanfolyamon! Mi nagyon élveztük, örültünk a rengeteg pozitív visszajelzésnek és konstruktív kritikának. 😊 Még nem búcsúzkodunk, hiszen még van egy hét, és egy fotókiállítás, amiről hamarosan írunk! Viszont akartunk szólni, hogy hamarosan újabb tanfolyamot indítunk. Sokan írtátok, hogy szívesen ajánlanátok a Photatot a barátaitoknak/kollégáitoknak. Gondoltuk, ez egy remek alkalom, hogy lehetőséget adjunk erre.</p>
        <p>Itt van pl. egy rövid üzenet, amit átküldhetsz azoknak, akiket szerinted érdekelhet:</p>
        <hr />
        <p><em>Képzeld, az elmúlt hetekben fotózni tanultam egy online suliban, és pár hét múlva indul egy újabb tanfolyamuk!<br />
            Arra gondoltam, téged is érdekelhet a fotózás.<br />
            Ha így van, jelentkezz itt: <ExternalLink href={config.course.signUpFormUrl}>{config.course.signUpFormUrl}</ExternalLink></em>
        </p>
        <hr />
        <p>Vagy kiírhatsz valami ilyesmit a faladra:</p>
        <hr />
        <p><em>Az elmúlt hetekben fotózni tanultam egy ingyenes, online suliban, és nagyon király volt. Hamarosan indul a következő tanfolyamuk, ajánlom mindenkinek! Ha érdekel, jelentkezz itt: <ExternalLink href={config.course.signUpFormUrl}>{config.course.signUpFormUrl}</ExternalLink></em>
        </p>
        <hr />
        <p>A feladatok a tervek szerint a következő tanfolyamon is nagyon hasonlóak lesznek a mostanihoz, szóval ha már egyszer végigcsináltad, nem feltétlenül ajánljuk újra, de ha nem adtál be annyi képet, mint tervezted, és megpróbálnád ismét, bátran iratkozz fel a következő körre itt: <ExternalLink href={config.course.signUpFormUrl}>{config.course.signUpFormUrl}</ExternalLink>
        </p>
        <p>És még egy dolog:</p>
        <p><strong>Mentorokat keresünk!</strong> Sokan jeleztétek, hogy jó lett volna több visszajelzés a képeitekre, viszont nekünk sajnos nem volt erre annyi időnk, mint szerettük volna. Ha érzed magadban az erőt, hogy besegíts nekünk kommentálni a beérkező képeket, küldj egy levelet a <ExternalLink href="mailto:photatophotato+mentor@gmail.com">photatophotato+mentor@gmail.com</ExternalLink> címre. Egy egy soros email teljesen elég, hogy „Mentornak jelentkezem”, a többiről emailben egyeztetünk. Nem hatalmas felelősség, de nekünk nagy segítség. 😊</p>
        <p>Hát, így. 😊</p>
        <p>Ha még nem küldted be a múlt heti (önarckép) képedet, ma éjfélig még azt is <PhotoUploadLink label="megteheted" />. 🕚</p>
        <p>Az e heti képeket pedig <PhotoUploadLink label="itt" /> várjuk!</p>
        <p>Jó fotózást,</p>
        <p>--<br />
            a Photato csapata</p>
    </>;
}