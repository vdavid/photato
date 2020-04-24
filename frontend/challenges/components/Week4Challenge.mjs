import {createElement} from '../../web_modules/react.js';
import htm from '../../web_modules/htm.js';

const html = htm.bind(createElement);
import FullWidthLocalImage from './FullWidthLocalImage.mjs';
import PhotoUploadLink from './PhotoUploadLink.mjs';
/**
 * @param {string} formattedDeadline
 * @returns {React.ReactElement}
 */
export default function Week4Challenge({formattedDeadline}) {
// noinspection SpellCheckingInspection
    return html`<p><strong>Röviden:</strong></p>

<p>A negyedik héten egy <strong>utcai fotót</strong> várunk tőled, amit <${PhotoUploadLink} label="itt tudsz feltölteni" />.</p>

<p><strong>Hosszabban:</strong></p>

<${FullWidthLocalImage} fileName="lomo.jpg" altText="Lomo" />

<p>Nagyon örülünk, hogy ilyen sokan beküldtétek az előző két hét képeit, és már a makrók is szépen érkezgetnek. 😊 Nagyon jó képeket küldtök, csak így tovább, és bátran adjatok tippeket/visszajelzéseket egymás képeire a galériákban.</p>

<p>A negyedik hét feladata, hogy légy néhány percre turista a saját városodban, és fotózd le az utca emberét. A legjobb képedet ${formattedDeadline}-ig, <${PhotoUploadLink} label="itt tudod feltölteni" />.</p>

<p><strong>Mi az utcai fotózás?</strong></p>

<p>Az utcai fotózás a hétköznapi élet dokumentálása. Nem az utca a lényeg: fotózhatsz reptéren, bevásárlóközpontban, tengerparton, parkban, aluljáróban, buszon, zöldségesnél, vagy bármilyen nyilvános helyen.</p>

<p><strong>A leggyakoribb kérdés: kell engedélyt kérnem azoktól, akiket lefotózok?</strong></p>

<p>Röviden: jogilag nem, de figyelj arra, hogy tisztelettel bánj embertársaiddal, és ne bánts meg és ne hozz zavarba senkit. Ha mégis így történik, oldd fel a helyzetet, pl. kérj elnézést, töröld ki a képet, vegyél nekik virágot stb.</p>

<p>Bővebben (<a href="http://www.szellemkeponline.hu/foto/a-fotozas-jogi-utvesztoi-i-resz-jogvedelem-a-fotozas-koreben//">forrás</a>):</p>
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
    <li>Három angol nyelvű cikk rövid kivonata a pixinfo-n: <a href="https://pixinfo.com/hirek/2012/01/19/nehany-tanacs-kezdo-utcai-fotosoknak/">John Batdorff tippjei</a> | <a href="https://pixinfo.com/hirek/2012/01/03/fekete-hattyu-az-utcan-avagy-mi-a-titka-a-street-photography-nek/">Eric Kim tippjei</a> | <a href="https://www.canon.hu/get-inspired/stories/street-photography/">A Canon inspirációs oldala</a></li>
    <li><a href="http://www.szellemkeponline.hu/foto/a-fotozas-jogi-utvesztoi-i-resz-jogvedelem-a-fotozas-koreben/">Az utcai fotózás jogi háttere Magyarországon</a> (3 részes cikk)</li>
    <li><a href="https://petapixel.com/2016/08/06/15-street-photography-techniques-tips/">Eric Kim 15 tippje</a> [angol]</li>
    <li><a href="http://www.erickimphotography.com/Downloads/Books/100LessonsFromtheMastersofStreetPhotography/100%20Lessons%20From%20the%20Masters%20of%20Street%20Photography.pdf">Eric Kim 100 tippje utcai fotózáshoz</a> [angol pdf]</li>
    <li>Filmajánló: Everybody Street [<a href="https://www.imdb.com/title/tt2784462/">imdb</a>] [<a href="https://vimeo.com/ondemand/everybodystreet/70639661">trailer</a>] – egy dokumentumfilm new yorki utcai fotósokról.</li>
</ul>

<p>Inspiráció: <a href="https://hu.pinterest.com/search/pins/?q=street%20photography&rs=typed&term_meta[]=street%7Ctyped&term_meta[]=photography%7Ctyped">Pinterest</a> | Mobile Photo Awards street photography: <a href="https://mobilephotoawards.com/street-photography-winner-honorable-mentions-6th-annual-mpa/">2016</a> | <a href="https://mobilephotoawards.com/street-photography-winner-honorable-mentions-2015-mpa/">2015</a> | <a href="https://mobilephotoawards.com/street-photography-2014-mpa-results/">2014</a> People: <a href="https://mobilephotoawards.com/people-winner-honorable-mentions-6th-annual-mpa/">2016</a> | <a href="https://mobilephotoawards.com/people-photos/">2015</a> | <a href="https://mobilephotoawards.com/people-2014-mpa-results/">2014</a></p>

<p>Ha még nem küldted be a múlt heti (makró) képedet, ma éjfélig még azt is <${PhotoUploadLink} label="megteheted" />. 🕚</p>

<p>Az utcai fotókat pedig <${PhotoUploadLink} label="itt" /> várjuk!</p>

<p>Jó fotózást,</p>

<p>--<br />
    a Photato csapata</p>`;
}