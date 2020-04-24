import {createElement} from '../../web_modules/react.js';
import htm from '../../web_modules/htm.js';

const html = htm.bind(createElement);
import FullWidthLocalImage from './FullWidthLocalImage.mjs';
import PhotoUploadLink from './PhotoUploadLink.mjs';
/**
 * @param {string} formattedDeadline
 * @param {string} baseUrl
 * @returns {React.ReactElement}
 */
export default function Week2Challenge({formattedDeadline, baseUrl = ''}) {
// noinspection SpellCheckingInspection
    return html`<p><strong>Röviden:</strong></p>
<p>A második hét témája: <strong>épületfotók</strong>!</p>
<p>Közben gyorsan megtanuljuk, mi a zoom, a blende és a záridő.</p>
<p>A legjobb képedet <${PhotoUploadLink} label="itt tudod feltölteni" />.</p>

<p><strong>Hosszabban:</strong></p>

<${FullWidthLocalImage} fileName="taj-mahal.jpg" altText="Nyugati tér" />

<p>Az e heti feladat épületek, nevezetességek, terek fotózása lesz. A legjobb képedet ${formattedDeadline}-ig, <${PhotoUploadLink} label="itt tudod feltölteni" />.</p>

<p>A múlt héthez hasonlóan most is megpróbáltuk összeszedni nektek a legjobb tippjeinket:</p>

<ol>
    <li><strong>Nézz körül.</strong> Figyeld meg a környezeted. A legtöbben nem vesszük észre, milyen király épületek mellett megyünk el mindennap. Nézz magasabbra, mint szoktál!</li>
    <li><strong>Tanulj egy kis elméletet.</strong> Ha tisztában vagy a fényképezés alapjaival, sokkal több lehetőséged lesz érdekes képeket csinálni. Különösen, ha fényképezőgépet használsz, vagy van profi kamera alkalmazás a telefonodon (Camera FV-5 Androidra – <a href="https://play.google.com/store/apps/details?id=com.flavionet.android.camera.lite">0ft</a> / <a href="https://play.google.com/store/apps/details?id=com.flavionet.android.camera.pro">899ft</a>, <a href="https://apps.apple.com/us/app/procam-7/id730712409">ProCam 7 iOS-re</a> – 2290ft).<br />Remek kiindulópont ez a 10 perces cikk, érdemes elolvasni: <a href="https://fotozasblog.hu/digitalis-fotozas/">Fotózás alapok: zoom, blende, záridő</a>.</li>
    <li><strong>Menj messzebb.</strong> Ha a teljes épületet akarod fotózni, figyelj rá, hogy valóban az egész épület beleférjen a képbe. Ha <a href="https://fotozasblog.hu/digitalis-fotozas/#optikaizoom">nagy látószögű</a> optikád van, könnyű a dolgod, de ha nincs, érdemes hátrébb menni.</li>
    <li><strong>Keresd meg a nézőpontod.</strong> Sétálj körbe, találd meg a magasságot. Nézz körül, honnan fotózhatsz még, ami nem magától értetődő: szomszédos épületről, távolról rázoomolva stb.</li>
    <li><strong>Állítsd be a kamerád.</strong> Ha kell, használj szűkebb <a href="https://fotozasblog.hu/digitalis-fotozas/#melysegelesseg">blende</a> beállítást, hogy nagyobb legyen az éles tartomány. Itt egy <a href="${baseUrl}/challenges/linked-images/depth-of-field.gif">gif a mélységélességről</a>.</li>
    <li><strong>Figyelj a kontextusra.</strong> Keretezd a kompozíciót más épületekkel, tárgyakkal. Ha emberek, autók vannak az épület körül, légy türelmes és várd meg, amíg elmennek, vagy fogadd el és használd őket, pl. a méretek érzékeltetésére.</li>
    <li><strong>Este használj állványt.</strong> Ha este/éjszaka fotóznál, használj állványt, vagy tedd le egy stabil helyre a gépet. Ha nincs állványod, jó trükk tud lenni egy pulcsira/sálra tenni a géped, és úgy beállítani. Telefonnal ez eggyel nehezebb, de egy idő után mindig sikerül megoldani. 😊</li>
</ol>

<p>Variációk:</p>
<ul>
    <li><strong>Zoomolj rá.</strong> Keress izgalmas kivágásokat, ahol érdekes a geometria vagy épületszobrászat. Ha menő, cserélhető objektíves géped van, használj a nagy látószögű lencse mellett teleobjektívet, vagy csak zoomolj rá a részletekre.</li>
    <li><strong>Menj be.</strong> És nézz körül. Sok épület belül is tartogat jól fotózható meglepetéseket.</li>
    <li><strong>Játssz az idővel.</strong> Fotózd le ugyanazt az épületet különböző időpontokban és időjárásban: hajnalban, reggel, délelőtt, délután, napnyugtakor, este. Napsütésben, esőben, havazásban (irány Norvégia! 😉), felhős ég alatt. Figyeld meg, hogy mikor mennyire kontrasztos, színekben gazdag, drámai a kép. Egy rossz időben készült fotónak is lehet érdekes hangulata. Ha nagyon színtelen a kép, készíts fekete-fehér fotókat. Délben nincs sok árnyék és hideg a fény. Állítsd be a fehéregyensúlyt az időnek megfelelően. (A fehéregyensúlyról majd még tanulunk később, de érdeklődőknek <a href="https://fotozasblog.hu/feher-egyensuly-beallitas-viszlat-sarga-fotok/">itt egy cikk elöljáróban</a>.)</li>
    <li><strong>Tükrözz.</strong> Használd ki a környezet felületeit: keress tükröződéseket egy pocsolyán vagy egy üvegfelületen</li>
    <li><strong>Szűrj.</strong> Ha profi fotócuccod van, próbálj ki egy sötét szűrőt, hogy nappal is hosszabb záridővel fotózhass és elmosódjanak az emberek.</li>
    <li><strong>Omolj.</strong> Fotózz omladozó, pusztuló épületeket, gyárakat.</li>
    <li><strong>Plankelj.</strong> Milliószor ugyanúgy lefotózott híres épületek? <a href="${baseUrl}/challenges/linked-images/washington.jpg">Feküdj be a képbe</a>.</li>
</ul>

<p>Linkek:</p>
<ul>
    <li>A legjobban a fentebb is linkelt <a href="https://fotozasblog.hu/digitalis-fotozas/">fotózás alapok: zoom, blende, záridő</a> cikket ajánljuk.</li>
    <li>További <a href="https://sg.hu/cikkek/it-tech/43737/hogyan-fotozzunk-varosok-megorokitese">tippek városi fotózáshoz</a> az sg.hu-n.</li>
    <li>Még <a href="https://www.canon.hu/get-inspired/tips-and-techniques/city-photography/">tippek városi fotózáshoz</a> a Canontól.</li>
</ul>

<p>Inspiráció: <a href="https://hu.pinterest.com/search/pins/?q=building%20photography">Pinterest</a> | <a href="https://hu.pinterest.com/search/pins/?q=budapest%20buildings">Pinterest / Budapest</a> | Mobile Photo Awards épületfotó győztesek: <a href="https://mobilephotoawards.com/architecture-design-winners-8th-annual-mpa/">2018</a> | <a href="https://mobilephotoawards.com/architecture-design-winner-honorable-mentions-7th-annual-mpa/">2017</a> | <a href="https://mobilephotoawards.com/architecture-design-winner-honorable-mentions-6th-mpa/">2016</a> | <a href="https://mobilephotoawards.com/architecture-design/">2015</a> | <a href="https://mobilephotoawards.com/architecture-design-2014-mpa-results/">2014</a> | <a href="https://mobilephotoawards.com/2013-mobile-photography-awards-architecturedesign-category-winners/">2013</a></p>

<p>Ha még nem küldted be a múlt heti (gasztrofotó) képedet, ma éjfélig még azt is <${PhotoUploadLink} label="megteheted" />. 🕚</p>

<p>Az épületes képeket pedig <${PhotoUploadLink} label="ide" /> várjuk!</p>

<p>Jó fotózást,</p>

<p>-- <br />
    a Photato csapata</p>`;
}