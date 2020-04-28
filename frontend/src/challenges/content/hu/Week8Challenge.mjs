import React from '../../../web_modules/react.js';
import FullWidthLocalImage from '../../components/FullWidthLocalImage.mjs';
import PhotoUploadLink from '../../components/PhotoUploadLink.mjs';
import ExternalLink from '../../../materials/components/ExternalLink.mjs';

// noinspection JSUnusedGlobalSymbols (It's imported dynamically.)
/**
 * @param {string} formattedDeadline
 * @returns {React.ReactElement}
 */
export default function Week8Challenge({formattedDeadline}) {
    return <>
<p><strong>Röviden:</strong></p>
<p>Ezen a héten egy <strong>csendélet-jellegű fotót</strong> várunk tőled, amit <PhotoUploadLink label="itt tudsz feltölteni" />.</p>
<p><strong>Hosszabban:</strong></p>

<FullWidthLocalImage fileName="jama.jpg" altText="Jama" caption="© Farkas Antal Jama" captionLink="https://hu.wikipedia.org/wiki/Farkas_Antal_(fot%C3%B3m%C5%B1v%C3%A9sz)" />

<p>Az elmúlt 3 hétben sokan kültéren, komfortzónán kívüli helyzetekben fotóztatok dinamikus, nehéz témákat. Tudjuk, hogy ez gyakran trükkös volt, és ezúton gratulálunk a bátor próbálkozásokhoz és a jól sikerült fotókhoz!</p>
<p>Sunyi módon, miközben a fotózást gyakoroltad ezekben az éles helyzetekben, a fényképezőgép legbonyolultabb beállításai is bejöttek a képbe (záridő, blende és ISO érték), és gyakoroltad őket egy kicsit. A tanulás nehezén ezzel túl vagy, gratulálunk! 😊</p>
<p>Ezen a héten eggyel békésebb vizekre evezünk és biztosítjuk, hogy a fotótémád ne szaladjon el. Ami pedig az elméletet illeti, egyetlen igazán fontos beállítás van hátra: a <em>fehéregyensúly</em>.</p>
<p><strong>Mi az a fehéregyensúly?</strong></p>
<p>Képzelj el egy fehérre festett házat. Képzeld el, hogy ránézel erre a házra egy nap négyszer: hajnalban, déli napfényben, felhős délutáni időben és szürkületben. A házról a szemedbe jutó fény a négy esetben egészen különböző lesz, mégis, mind a négy alkalommal fehérnek fogod látni a házat.</p>
<p>Ez azért van, mert az agyad a fényviszonyoknak megfelelően, automatikusan korrigálja, hogy milyen színűnek látja a környezeted. Mint pl. ebben a klasszikus optikai illúzióban:</p>

<FullWidthLocalImage fileName="illusion.png" altText="Optikai illúzió" />

<p>Az “A” és “B” négyszög színe pontosan ugyanaz, valószínűleg mégis jóval sötétebbnek látod az “A”-t, mert az agyad értelmezi a képet és korrigál. Ez az optikai illúzió ennek a képességnek a határait mutatja be, de ez a képesség a hétköznapokban nagyon hasznos: például a napszaktól függetlenül meg tudod állapítani, hogy a fentebb elképzelt házad fehér. 😀</p>
<p>Amit a szemed/agyad ilyen remekül megold, azt a fényképezőgépedben egy közepesen okos automatika próbálja lekövetni. Ez időnként hibázik, és ilyenkor a géped segítségre szorul: kézzel kell megtalálnod a tiszta fehér színt, hogy az elkészült kép színei hűek legyenek a fotótémád valódi színeihez. Ezt hívják fehéregyensúly-beállításnak.</p>
<p>A cél, hogy a fehér szín tényleg fehér legyen, ne pedig sárga, kékes stb. Bővebb infókért jó szívvel ajánljuk a témában <ExternalLink href="https://studioeszkozok.hu/blog/feheregyensuly-es-szinhomerseklet-a-digitalis-fotoknal">a studioeszkozok.hu cikkét</ExternalLink>.</p>
<p>A fehéregyensúlyhoz kapcsolódó fogalom a <em>színhőmérséklet</em>, melyet <em>Kelvin</em>ben mérnek, jele “K”. Az egyes fehéregyensúly-beállításokhoz bizonyos színhőmérsékletek tartoznak. Itt van néhány példa, amikor valószínűleg a fényképezőgéped is támogat, mint alapbeállításokat:</p>
<ul>
    <li>Hagyományos izzó (3200 K)</li>
    <li>Fénycső (3800-4000 K)</li>
    <li>Tiszta napsütés (5000-5600 K)</li>
    <li>Vaku (5500-5600 K)</li>
    <li>Felhős idő (5600-6000 K)</li>
    <li>Árnyék (6200-8000 K)</li>
</ul>
<p>Itt van pl. ugyanaz a karó különböző fehéregyensúly-beállításokkal fényképezve, napos időben:</p>

<FullWidthLocalImage fileName="temperature.jpg" altText="Oszlopok" />

<p>Ahhoz, hogy helyes színeket kapj, a gép fehéregyensúlyát a fényforrásnak megfelelően kell beállítani. A legtöbb esetben a gép AWB (Automatic White Balance – automatikus fehéregyensúly) beállítása jól működik. A leggyakrabban mesterséges fényforrásoknál szokott hibázni: itt érdemes kézzel kiválasztani a megfelelő alapbeállítást, vagy ha egyik sem stimmel, egyéni (“custom”) fehéregyensúlyt választani.</p>
<p>Ha többféle fényforrás van egy helyen (pl. lámpa és az ablakon besütő napfény, vagy lámpa és TV), az még nehezebb eset. Ilyenkor érdemes elfogadni, hogy nem lesz tökéletes a kép, és eldönteni, hogy melyik fényforráshoz igazítod (manuálisan) a fehéregyensúlyt; vagy ha Photoshop-guru vagy, akkor utómunkával megoldani.</p>
<p>Ha tömörített (JPG) formátumban fotózol, akkor különösen érdemes figyelni a jó beállításra, mert nehéz lesz utólag kijavítani a képet. Ha nyers (RAW) formátumban fotózol, akkor kisebb a rizikó: ilyenkor utólag is pontosan be lehet állítani a fehéregyensúlyt. (A formátum beállítása gépenként változó, a géped használati utasítása segíthet, vagy csak turkálj kicsit a menürendszerben, 5 perc és meglesz.) Itt van még egy jó cikk <ExternalLink href="https://fotozasblog.hu/feher-egyensuly-beallitas-viszlat-sarga-fotok/">a fehéregyensúly-beállításról</ExternalLink>.</p>
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
    <li>A studioeszkozok.hu cikke <ExternalLink href="https://studioeszkozok.hu/blog/feheregyensuly-es-szinhomerseklet-a-digitalis-fotoknal">a fehéregyensúlyról</ExternalLink>.</li>
    <li>A fotozasblog.hu cikke szintén <ExternalLink href="https://fotozasblog.hu/feher-egyensuly-beallitas-viszlat-sarga-fotok/">a fehéregyensúlyról</ExternalLink></li>
    <li>10 remek tipp <ExternalLink href="https://photography.tutsplus.com/hu/tutorials/10-tips-to-get-started-with-still-life-photography--photo-8278">a csendélet-fotózás elkezdéséhez</ExternalLink></li>
    <li>A komponálási technikákról: <ExternalLink href="https://tisztaegtisztafold.hu/komponalas-geometria/">6 komponálási és geometriai tipp</ExternalLink></li>
</ul>
<p><strong>Ötletek, variációk</strong></p>
<ul>
    <li>Gyűjtemények: <ExternalLink href="https://hu.pinterest.com/pin/424464333613794639/">egyszínű dolgok</ExternalLink>, egy témához kapcsolódó tárgyak összerendezve</li>
    <li><ExternalLink href="https://hu.pinterest.com/pin/439171401157788730/">Lebegő tárgyak</ExternalLink></li>
</ul>
<p><strong>Inspiráció:</strong> <ExternalLink href="https://hu.pinterest.com/search/pins/?q=still%20life%20photography">Pinterest csendéletek</ExternalLink> | <ExternalLink href="https://www.pexels.com/search/still%20life/">Pexels</ExternalLink> | Mobile Photo Awards épületfotó győztesek: <ExternalLink href="https://mobilephotoawards.com/3rd-annual-mobile-photography-awards-winners-honorable-mentions/">2013</ExternalLink> | <ExternalLink href="https://mobilephotoawards.com/still-life-2014-mpa-results/">2014</ExternalLink> <ExternalLink href="https://mobilephotoawards.com/still-life/">2015</ExternalLink> | <ExternalLink href="https://mobilephotoawards.com/still-life-winner-honorable-mentions-6th-annual-mpa/">2016</ExternalLink> | <ExternalLink href="https://mobilephotoawards.com/still-life-winner-honorable-mentions-7th-annual-mpa/">2017</ExternalLink></p>
<p>Ha még nem küldted be a múlt heti (hosszú exponálási idejű) képedet, ma éjfélig még azt is <PhotoUploadLink label="megteheted" />. 🕚</p>
<p>A csendéleteket pedig ${formattedDeadline}-ig, <PhotoUploadLink label="itt tudod feltölteni" />.</p>
<p>Jó fotózást,</p>
<p>--<br />
    a Photato csapata</p>
</>;
}