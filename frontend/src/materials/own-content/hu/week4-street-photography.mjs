import React from '../../../web_modules/react.js';
import ExternalLink from '../../components/ExternalLink.mjs';

// noinspection JSUnusedGlobalSymbols (This file is loaded dynamically.)
/**
 * @returns {ArticleMetadata}
 */
export function getMetadata() {
    // noinspection SpellCheckingInspection (It's in Hungarian.)
    return {
        slug: 'utcai-fotozas-tippek',
        title: 'Utcai fotózás tippek',
        author: 'Photato',
        publishDate: new Date('2020-06-07'),
        publisherName: 'Photato',
        unlockWeekIndex: 4,
    };
}

// noinspection JSUnusedGlobalSymbols (This file is loaded dynamically.)
/**
 * @returns {React.ReactElement}
 */
export default function Article() {
    // noinspection SpellCheckingInspection (It's in Hungarian.)
    return <>
        <p><strong>Mi az utcai fotózás?</strong></p>

        <p>Az utcai fotózás a hétköznapi élet dokumentálása. Nem az utca a lényeg: fotózhatsz reptéren, bevásárlóközpontban, tengerparton, parkban, aluljáróban, buszon, zöldségesnél, vagy bármilyen nyilvános helyen.</p>

        <p><strong>A leggyakoribb kérdés: kell engedélyt kérnem azoktól, akiket lefotózok?</strong></p>

        <p>Röviden: jogilag nem, de figyelj arra, hogy tisztelettel bánj embertársaiddal, és ne bánts meg és ne hozz zavarba senkit. Ha mégis így történik, oldd fel a helyzetet, pl. kérj elnézést, töröld ki a képet, vegyél nekik virágot stb.</p>

        <p>Bővebben (<ExternalLink href="http://www.szellemkeponline.hu/foto/a-fotozas-jogi-utvesztoi-i-resz-jogvedelem-a-fotozas-koreben//">forrás</ExternalLink>):</p>
        <ul>
            <li>Közterületen szabad embereket fotózni, kivéve közfeladatot ellátó személy arcát vagy azonosító számát.</li>
            <li>Ha egyszerre sok ember van a képen, gond nélkül publikálhatod is a képeket.</li>
            <li>Ha a képen kiemelten szerepel 1-1 ember, és felismerhetőek, engedélyt kell adniuk a fényképezésre ahhoz, hogy publikáld a képet. (Tehát fényképezni enélkül is szabad, publikálni nem.) Ráutaló magatartás is számít: pl. ha mosolyog a kamerába és integet.</li>
        </ul>

        <p><strong>Néhány további tipp:</strong></p>

        <ol>
            <li><strong>Légy résen.</strong> Vedd észre a környezeted, amiben nap mint nap élsz, és csodálkozz rá. Ami neked hétköznapi, másnak lehet különleges.</li>
            <li><strong>Légy bátor.</strong> Rajtad áll, hogy engedélyt kérsz vagy elnézést, de mindkét megoldáshoz kell némi bátorság.</li>
            <li><strong>Ha inkább engedélyt kérnél:</strong> Gyakran úgy születik egy jó kép, hogy előre szólsz a fotóalanynak, mire ő felvesz egy jó beállást, amit egyébként nem tenne meg. A fontos, hogy elkapj egy őszinte érzelmet és megragadd az alany személyiségét.</li>
            <li><strong>Ha inkább elnézést kérnél:</strong> Ha úgy döntesz, hogy észrevétlenül fotóznál, használj kis kamerát vagy a mobilodat, így kisebb eséllyel vesznek észre az emberek.</li>
            <li><strong>Légy türelmes.</strong> Ahhoz, hogy meg tudd ragadni a döntő pillanatot, időre lehet szükséged, hogy bele tudd élni magad a helyszínbe, az utca/tér életébe.</li>
            <li><strong>Zoomolj rá.</strong> Ha tudsz, használj legalább 35mm-es objektívet/beállítást. Ha van teleobjektíved, távolról, észrevétlenül is el tudsz kapni élethelyzeteket, és jó minőségben megörökíteni őket.</li>
            <li><strong>Készíts több képet.</strong> Akár 10-15-öt. Nem beállított képeknél gyorsan változhat a téma, bemozdulhatnak az emberek vagy a gép. De még ha alig különböznek is a fotók, a válogatásnál mindenképp nagyobb lesz a szabadságod. A legnagyobb mesterek is gyakran 10-30 képet lőnek.</li>
        </ol>

        <p><strong>Ötletek, variációk:</strong></p>

        <ul>
            <li><strong>Ellentétek:</strong> Komponálj egy képbe kontrasztos szereplőket, elemeket. Pl. öreg – fiatal, testes – sovány, gazdag – szegény, fehér ruhás – fekete ruhás, boldog – szomorú stb.</li>
            <li><strong>Érzelmek:</strong> Keresd érzelmek, állapotok erős kifejezéseit. Pl. boldogság, fájdalom, fiatalság, szomorúság, vidámság, magány, idegesség, bohóság, unalom, szerelem stb.</li>
            <li><strong>Vizuális elemek:</strong> Nem mindig kell/lehet érzelmeket elkapni. Hogy érdekessé tedd a képeid, használhatsz erős érzelmek helyett erős vizuális elemeket is. Keress olyan környezetet, ahol a szereplőket erős színek, érdekes fény/árnyék jelenség vagy erős vonalak, formai elemek veszik körül, vagy ahol ezek összességéből egy izgalmas képet tudsz komponálni.</li>
            <li><strong>Részletek:</strong> Fókuszálj a részletekre. Nem mindig kell az egész alaknak a képben lenni. Sokszor elég csak egy-egy része is, pl. testrész, öltözék, testékszer.</li>
            <li><strong>Emberekről, emberek nélkül:</strong> Nem kell mindig szereplő a képre. Sokszor egy városi látkép, utcarészlet is sokat elárul a társadalmi állapotokról és az emberekről, akik ott élnek.</li>
            <li><strong>Szemét:</strong> Talált tárgyak az utcán, a földön.</li>
        </ul>

        <p>Linkek:</p>
        <ul>
            <li>Három angol nyelvű cikk rövid kivonata a pixinfo-n: <ExternalLink href="https://pixinfo.com/hirek/2012/01/19/nehany-tanacs-kezdo-utcai-fotosoknak/">John Batdorff tippjei</ExternalLink> | <ExternalLink href="https://pixinfo.com/hirek/2012/01/03/fekete-hattyu-az-utcan-avagy-mi-a-titka-a-street-photography-nek/">Eric Kim tippjei</ExternalLink> | <ExternalLink href="https://www.canon.hu/get-inspired/stories/street-photography/">A Canon inspirációs oldala</ExternalLink></li>
            <li><ExternalLink href="http://www.szellemkeponline.hu/foto/a-fotozas-jogi-utvesztoi-i-resz-jogvedelem-a-fotozas-koreben/">Az utcai fotózás jogi háttere Magyarországon</ExternalLink> (3 részes cikk)</li>
            <li><ExternalLink href="https://petapixel.com/2016/08/06/15-street-photography-techniques-tips/">Eric Kim 15 tippje</ExternalLink> [angol]</li>
            <li><ExternalLink href="http://www.erickimphotography.com/Downloads/Books/100LessonsFromtheMastersofStreetPhotography/100%20Lessons%20From%20the%20Masters%20of%20Street%20Photography.pdf">Eric Kim 100 tippje utcai fotózáshoz</ExternalLink> [angol pdf]</li>
            <li>Filmajánló: Everybody Street [<ExternalLink href="https://www.imdb.com/title/tt2784462/">imdb</ExternalLink>] [<ExternalLink href="https://vimeo.com/ondemand/everybodystreet/70639661">trailer</ExternalLink>] – egy dokumentumfilm new yorki utcai fotósokról.</li>
        </ul>

        <p>Inspiráció: <ExternalLink href="https://hu.pinterest.com/search/pins/?q=street%20photography&rs=typed&term_meta[]=street%7Ctyped&term_meta[]=photography%7Ctyped">Pinterest</ExternalLink> | Mobile Photo Awards street photography: <ExternalLink href="https://mobilephotoawards.com/street-photography-winner-honorable-mentions-6th-annual-mpa/">2016</ExternalLink> | <ExternalLink href="https://mobilephotoawards.com/street-photography-winner-honorable-mentions-2015-mpa/">2015</ExternalLink> | <ExternalLink href="https://mobilephotoawards.com/street-photography-2014-mpa-results/">2014</ExternalLink> People: <ExternalLink href="https://mobilephotoawards.com/people-winner-honorable-mentions-6th-annual-mpa/">2016</ExternalLink> | <ExternalLink href="https://mobilephotoawards.com/people-photos/">2015</ExternalLink> | <ExternalLink href="https://mobilephotoawards.com/people-2014-mpa-results/">2014</ExternalLink></p>
    </>;
}