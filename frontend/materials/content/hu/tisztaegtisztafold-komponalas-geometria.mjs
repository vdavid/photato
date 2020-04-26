import {createElement} from '../../../web_modules/react.js';
import htm from '../../../web_modules/htm.js';
import SimpleFigure from '../../components/SimpleFigure.mjs';
import EnlargeableFigure from '../../components/EnlargeableFigure.mjs';
import ExternalLink from '../../components/ExternalLink.mjs';
const html = htm.bind(createElement);

// noinspection JSUnusedGlobalSymbols (This file is loaded dynamically.)
/**
 * @returns {ArticleMetadata}
 */
export function getMetadata() {
    // noinspection SpellCheckingInspection (It's in Hungarian.)
    return {
        slug: 'tisztaegtisztafold-komponalas-geometria',
        title: '6 komponálási és geometriai tipp a szebb fényképekért',
        author: 'Mayer Miklós',
        publishDate: new Date('2018-07-09'),
        publisherName: 'Tiszta ég, tiszta föld',
        originalUrl: 'https://tisztaegtisztafold.hu/komponalas-geometria/',
        isOriginalUrlBroken: false,
    };
}

// noinspection JSUnusedGlobalSymbols (This file is loaded dynamically.)
/**
 * @returns {React.ReactElement}
 */
export default function Article() {
    // noinspection SpellCheckingInspection (It's in Hungarian.)
    return html`<div>
    <p>Szög, geometria, jó szög, rossz szög, nincsen szögben. Folyton ezt hallottam Szipál Martintól, amikor a fotótanfolyamára jártam… Eleinte nem igazán tudtam, hogy miről is beszél, aztán lassan kezdtem megérteni.</p>
    <p>Egy fénykép attól is szép, ha valamilyen szép geometriai forma kirajzolódik rajta. És mitől szép egy geometriai forma?</p>
    <p>Hogy a természetben megtalálható, és ezáltal az ÉLETET tükrözi.</p>
    <p>Ebben a bejegyzésben utánajárok, milyen szabályok léteznek a komponálásra. Egyszerű elvek, amikre ha figyelek, szebbé teszik a képet.</p>
    <p>Hogy illusztráljam az írást, megkértem pár elismert hazai fotóst, hogy egy-egy képükkel és hozzá fűzött szövegükkel járuljanak hozzá az íráshoz.</p>
    <p>Ezúton is köszönet nekik!</p>
    
    <h2>Tartalom</h2>
    <ul>
        <li><a href="#1_Aranymetszes">1. Aranymetszés</a></li>
        <li><a href="#2_Harmadolas">2. Harmadolás</a></li>
        <li><a href="#3_Sokszogek_es_atlok_hasznalata">3. Sokszögek és átlók használata</a></li>
        <li><a href="#4_Keretbe_foglalas">4. Keretbe foglalás</a></li>
        <li><a href="#5_Egyensuly_legyen">5. Egyensúly legyen</a></li>
        <li><a href="#Komponalasi_erzek_fejlesztese">Komponálási érzék fejlesztése</a>
            <ul>
                <li><a href="#Fenykepek_es_festmenyek_tanulmanyozasa">Fényképek és festmények tanulmányozása</a></li>
                <li><a href="#Fotozas_fix_objektivvel">Fotózás fix objektívvel</a></li>
                <li><a href="#Rajzolas">Rajzolás</a></li>
            </ul>
        </li>
    </ul>
    
    <h2 id="1_Aranymetszes">1. Aranymetszés</h2>
    <p>Az egyik legelemibb kompozíciós elv az, hogy a témának azt a részét, amire a legtöbb figyelmet szeretném vonni, a kép egyik aranymetszés által kijelölt pontjába / vonalára rakom.</p>
    <p>De mi is az aranymetszés?</p>
    <p>Van egy szakaszom (pl. a fotó hosszabbik oldala), amit úgy szeretnék felosztani, hogy a nagyobbik rész úgy arányoljon a kisebbhez, mint az egész a nagyobb részhez. Lerajzolva talán könnyebben érthető:</p>
    <${SimpleFigure} fileName="Image-Golden_ratio_line.png" altText="Golden ratio line" />
    <p>Azaz <em>a</em> úgy aránylik a <em>b</em>-hez, ahogy <em>a+b</em> az <em>a-hoz.</em> Ez pont 61,8%-nál van (vagy 38,2%-nál, ha a másik oldalról nézem).</p>
    <p>Tehát ha egy szakaszt 61,8%-nál elmetszem, akkor az az aranymetszés. Ez majdnem megfelel egyharmad-kétharmados felosztásnak, ezért az ún harmadolási szabály is innen ered (erről bővebben később).</p>
    <p>Érdekesség, hogy a 61,8% (0,618) ugyanannyi, mint 1 /(1 + 0,618). És ahogy az lenni szokott az érdekes számokkal, ő is irracionális, azaz 0,618 csak egy kerekítés.</p>
    <p>De vissza a fényképekhez!</p>
    <p>Például ezt a fotót a Budai Várról úgy komponáltam, hogy a torony az aranymetszésbe essen:</p>
    <${EnlargeableFigure} fileName="aranymetszes-vonalak-2.jpg" altText="Aranymetszés vonalak 2" caption="Fotó: Mayer Miklós" />
    <${EnlargeableFigure} fileName="aranymetszes-vonalak-62.jpg" altText="Aranymetszés vonalak 62%" />
    <p>Mivel a természetben számtalan helyen megjelenik, így agyunk ezt egy “szép”, élő aránynak látja.</p>
    <p>Nemcsak a 61,8% jelenik meg sok helyen, hanem az ún Fibonacci számok is. A Fibonacci számsor: 1, 1, 2, 3, 5, 8, 13, 21,… Azaz minden tag az előző kettő összege.</p>
    <p>És hogy mi köze a Fibonacci számsornak az aranymetszéshez? Ha bármely tagot elosztjuk az előzővel, akkor ez a hányados a már említett 1,618-hoz közelít.</p>
    <p>Például:</p>
    <ul>
        <li>5/3 = 1,666</li>
        <li>8/5 = 1,6</li>
        <li>13/8 = 1,625</li>
        <li>21/13 = 1,615</li>
    </ul>
    <p>És így tovább: ahogy a számok nőnek, úgy közelít a hányados 1,618-hoz.</p>
    <p>A természetben számos példa van a Fibonacci sorozat számaira:</p>
    <p>A virágszirmok száma gyakran Fibonacci-szám (3, 5, 8, stb darab szirom). Persze itt bőven akadnak kivételek.</p>
    <${EnlargeableFigure} fileName="5-szirom-virag-6372-2.jpg" altText="5 darab sárga virágszirom" />
    <p>Másik példa a napraforgó, melynek magjai Fibonacci-spirálokba rendeződnek (ami az arany spirálnak felel meg). A balra és jobbra hajló spirálok száma mindig a Fibonacci sorozat tagjai közül valók.</p>
    <${EnlargeableFigure} fileName="napraforgo-fibonacci-szamok-2.jpg" altText="Napraforgó spirálok számai Fibonacci számok" caption="Fotó: Mayer Miklós" />
    <p>A fenti virágon 55 darab spirál helyezkedik el az óramutató járásával egyezően, és 89 óramutató járásával ellentétesen. Nem kevés időmbe telt, míg leszámoltam… Megkönnyebbültem a végére, hogy a napraforgó is tudta, hogyan kell nőnie 🙂</p>
    <p>Azért rendeződnek Fibonacci-spirálba a szemek, mert ilyen elosztásban optimálisan betöltik a teret. És mindig, mindegyik új magnak azonosan egy szögben kell elfordulnia. Ez a szög pontosan megegyezik azzal, ha egy kört az aranymetszésnek megfelelően osztok fel. Akit komolyabban érdekel, az elvicceskedhet az <${ExternalLink} href="https://www.mathsisfun.com/numbers/nature-golden-ratio-fibonacci.html">ezen az oldalon</a> található kalkulátorral.</p>
    <p>Vissza a fotózáshoz!</p>
    <p>Klasszikus példa az aranymetszésre <strong><${ExternalLink} href="http://mezofoldfoto.hu/">Krizák István</a></strong> <em>Éjjeli őrjárat</em> című fényképe.</p>
    <${EnlargeableFigure} fileName="Aranymetszes-Kizak-Istvan-ejjeli-orjarat.jpg" altText="Aranymetszés Krizák István" caption="Fotó: Krizák István / mezofoldfoto.hu" />
    <blockquote>
        <p>Az éjszakázóhelyére érkező, megkésett darucsapat ábrázolásánál egyértelmű volt számomra, hogy kedvenc kompozíciós szabályom, az aranymetszés alkalmazásával helyezem el a teliholdat a fényképezőgép keresőjében. Már csak a madarak érkezésére kellett várnom.</p>
        <p>A hosszú záridő miatt a csapat mozgása is érzékelhetővé vált, szerencsés elrendeződésükkel pedig (további kompozíciós elemként) majdnem tökéletes átlóban megfelezik a képet, sötét és világos részre osztva azt.</p>
        <p><cite><${ExternalLink} href="http://mezofoldfoto.hu/">Krizák István</a></cite></p>
    </blockquote>
    <p>Ha egy tégalalapot folyamatosan aranymetszés szerint osztok, és mindig kört rajzolok a metszéspontokból, megkapom az ún arany-spirált:</p>
    <${EnlargeableFigure} fileName="goldenspiral4.png" altText="aranyspirál" />
    <p>Az aranyspirált követő kompozícióra álljon itt <strong><${ExternalLink} href="http://www.selmeczidaniel.com/">Selmeczi Dániel</a></strong> fényképe:</p>
    <${EnlargeableFigure} fileName="selmeczi-aranymetszes-spiral-odarajzolva.jpg" altText="selmeczi aranymetszes spiral odarajzolva" caption="Fotó: Selmeczi Dániel / www.selmeczidaniel.com" />

    <h2 id="2_Harmadolas">2. Harmadolás</h2>
    <p>Az aranymetszésből ered az ún. harmadolási szabály is, hiszen a 61,8% nagyon közel áll a kétharmadhoz (66,7%).</p>
    <p>Így néz ki a kettő közt a különbség. Az aranymetszéses az, ahol a középső téglalap sokkal kisebb.</p>
    <${EnlargeableFigure} fileName="aranymetszes-harmadolas-gif.gif" altText="aranymetszes harmadolas gif" />
    <p>A szabály tehát egyszerű: úgy érdemes komponálni, hogy a képet harmadoló vonalak mentén vagy azok metszéspontjában helyezkedjen el a téma.</p>
    <p>Például a föld és ég találkozását, a horizonot érdemes az alsó vagy felső harmadra helyezni.</p>
    <${EnlargeableFigure} fileName="harmadolas-tajkepen-budai-varbol.jpg" altText="harmadolas tajkepen budai varbol" caption="Fotó: Mayer Miklós" />
    <${EnlargeableFigure} fileName="harmadolas-naplemente.jpg" altText="harmadolas naplemente" caption="Fotó: Mayer Miklós, részlet egy timelapse videómból" />
    <p>Amikor 2011 januárjának egyik hajnalán, a Hármashatár-hegyen járva elém tárult a ködbe borított város, a kilógó Főtáv kéménnyel, én is “ösztönösen” jobbra, a harmadolásnak megfelelően komponáltam. De fogalmam sincs, hogy miért a jobb oldalra, valahogy így volt jó érzés ránézni.</p>
    <p>Részletes <${ExternalLink} href="https://tisztaegtisztafold.hu/budapest-kodben-timelapse-video/">sztori és timelapse videó itt</a>.</p>
    <${EnlargeableFigure} fileName="hármashatár-hegy-IMG_7669.jpg" altText="Budapest ködben hármashatár hegyről, csak a Főtáv kémény látszik ki." caption="Fotó: Mayer Miklós" />
    <p>Kiváló példa <strong>Vadász Anna</strong> <em>Tavaszi ébredés</em> című fényképe is:</p>
    <${EnlargeableFigure} fileName="Vadasz-Anna-Tavasz-szuletik-harmadolas.jpg" altText="Harmadolási szabály Vadász Anna fényképén" caption="Fotó: Vadász Anna / Anna Vadász Photography" />
    <blockquote>
        <p>Egy olyan felvételt választottam, ami az évszaknak is megfelelő és sok természet szerető ember aktuális fotó témája lehet.</p>
        <p>A tavasz születik című képemet pár éve március közepén készítettem Szeged közelében a virágzó tarka sáfrányokról.
            <br /> Sokan egyből nekiláttak volna egy-egy szálat makrózni, én viszont igyekeztem megörökíteni a virágszőnyeg egy nagyobb darabját, mivel ritkán láthatóak ilyen sűrűségben (ezért is volt szerencsés az az év). Próbáltam az erdő hangulatát a háttérben lévő fákkal is szemléltetve visszaadni, így mindenképp szerettem volna őket a fotómba komponálni.</p>
        <p>A kép készítésekor a harmadolási szabályt alkalmaztam, amitől úgy gondolom egy letisztult, harmonikus eredményt kaptam, miközben a kis mélységélesség segített kiemelni az egyik legkorábban nyíló, védett tavaszi vadvirágunkat.</p>
        <p><cite><${ExternalLink} href="https://www.facebook.com/AnnaVadaszPhotography/">Vadász Anna</a></cite></p>
    </blockquote>
    <p><${ExternalLink} href="https://www.facebook.com/klararajnaiphotography/"><strong>Rajnai Klára</strong></a> csodálatos fényképével először bajban voltam: melyik ponthoz illesszem be? Mert hiába jó érzés nézni, nem tudtam hol megfogni a leírást.</p>
    <p>Aztán rájöttem, hogy itt is a harmadolás-aranymetszés szabálya játszik, amit az alkotó azzal spékelt meg, hogy direkt középre komponálta a fát. Ezáltal az elhúzó madárraj egy érdekes feszültséget ad a képnek, míg a talaj és a fa koronájának elhelyezése egyensúlyt.</p>
    <${EnlargeableFigure} fileName="Rajnai-Klara-white-dream.jpg" altText="Rajnai Klára white dream" caption="Fotó: Rajnai Klára / Klara Rajnai Photography" />
    
    <h2 id="3_Sokszogek_es_atlok_hasznalata">3. Sokszögek és átlók használata</h2>
    <p>Emberek fotózásánál különösen fontos, hogy a testük szép szöget zárjon be. Vagy önmagával, vagy a környezettel. A jó fotósok és modellek tudják ezt, és igyekeznek olyan pózt felvenni, ami valamilyen sokszöget kirajzol és betölti a teret.</p>
    <p>Például ezen a fényképemen legalább 3 db, egymással hasonló háromszöget lehet észrevenni:</p>
    <${EnlargeableFigure} fileName="Haromszogek-Balha-Gabi.jpg" altText="Haromszogek Balha Gabi" caption="Fotó: Mayer Miklós" />
    <p>Míg az embereket lehet instruálni, addig a tájfotózásban aktívan keresni kell a szögeket.</p>
    <p>Ahogy Ansel Adams mondta:</p>
    <blockquote>
        <p>A tájfotózás a fényképész legmagasabb szintű tesztelése. És gyakran a legnagyobb csalódása.</p>
    </blockquote>
    <p>Szerintem is, egy szép tájon sokkal nagyobb megtalálni a jó kompozíciót, mint lefényképezni azt.</p>
    <p>Egy példa erre a Csetény mellett fekvő dombok, melyre kiváló rálátás nyílik a szélerőművek mellől. A gyönyörű látvány mellett mégsem volt egyszerű megtalálni azt a szöget, ami a legjobban tetszett. Végülis ez lett a kedvenc:</p>
    <${EnlargeableFigure} fileName="atlos-aranymetszes-vonalak-kicsi.jpg" altText="atlos aranymetszes vonalak kicsi" caption="Fotó: Mayer Miklós" />
    <p>Elsőre nem tűnik fel, de négy, a sarkokból induló háromszög harmadolja el a képet:</p>
    <${EnlargeableFigure} fileName="atlos-vonalak-kompozicio-berajzolva.jpg" altText="atlos vonalak kompozicio berajzolva" caption="Fotó: Mayer Miklós" />
    <p>Másik saját példám arra, hogy érdemes a sarkokba mutató vonalakat komponálni.</p>
    <p>Az Erzsébet-híd vízszintesen állva kicsit unalmas ebből a szögből. Azonban megdöntve, úgy hogy az autók fénycsíkjai a sarokba fussanak, már sokkal izgalmasabb:</p>
    <${EnlargeableFigure} fileName="geometria-atlos-vonal-erszebet-hid-ejjel.jpg" altText="Elisabeth bridge in Budapest at night" caption="Fotó: Mayer Miklós" />
    <p>Tipp: a képek döntése embereknél is sokat segít!</p>
    <p>Mégis ki vesz észre ilyet, kinek jut ilyen eszébe?</p>
    <p>Például hazánk neves Photoshop művészének, <strong><${ExternalLink} href="http://www.floraborsi.com/">Borsi Flórának</a></strong>. Én a fejemet fogtam, amikor ezt a fotót megláttam: vajon hányszor láttam már ilyet, de egyszer sem vettem így észre???</p>
    <p>Nem földi, hanem égi példa <strong><${ExternalLink} href="http://pleiades.hu">Fényes Lóránd</a></strong> gyönyörű fotója az <em>Ádám teremtése</em> nevezetű mély-ég objektumról:</p>
    <${EnlargeableFigure} fileName="Adam-teremtese-Fenyes-Lorand.jpg" altText="Ádám teremtése Fényes Loránd" caption="Forrás: Fényes Lóránd / fenyeslorand.hu" />
    <blockquote>
        <p>A kompozíció kérdése azért nagyon érdekes, mert az asztrofotográfia látszólag egy statikus világ bemutatására tett kísérlet, ahol – szemben a földi fotográfiával nem a jelenben, az általunk is érzékelhető időben való mozgásban – hanem a mi időnkhöz képest “megkövült” állapotban, a múltba nézve örökítünk meg dolgokat.</p>
        <p>Pedig ennél nagyobbat nem is tévedhetnénk!</p>
        <p>Az univerzum nagyon gazdag és számos kompozíciós játékra ad lehetőséget ez az elképesztően hatalmas világ. Az űrben rejlő objektumok minden átfogásban más arcukat mutatják. Átlók, metszéspontok, súlyok, geometriai formák… ennél gazdagabb kompozíciós lehetőséget elképzelni is nehéz. Két fő területet tudnék kiemelni a kérdésedre.</p>
        <p>Az egyik azoknak a képeknek a sora, ahol csillagászati értelemben nem különösebben gazdag a kép, ám a csillagok elhelyezkedése kifejezetten esztétikus, a fotográfiai kompozíciós szabályoknak szerint nyújt vizuális élményt. Erre példa az <${ExternalLink} href="http://fenyeslorand.hu/gyemantok-a-csillagtengerben/">M7 csillaghalmaz</a>, ahol a tenger csillagmező előtt ragyogó, aranymetszés közelében elhelyezkedő kék csoportot a sötét porködök zárójele öleli körbe, vagy az <${ExternalLink} href="http://fenyeslorand.hu/csillaghalmaz-csillaglanc/">NGC 2547</a> nyílthalmaz, ahol három téma is feszül a képen: a névadó csoport bal alul aranymetszés közelében, a különös, egyenes aszterizmus nyílegyenes csillaglánca és a nagy méretű kék és sárga csillagok bal felső sarokból a jobb alsóba tartó íve.</p>
        <p>A másik nagy területet azok a képek fedik le, ahol a fényképen a szemlélő – eleresztve a fantáziáját – a kompozíció miatt földi témákra hajazó formákat azonosíthat be a fényképen. Valahogy úgy, ahogy a felhőkben is megtaláljuk azokat a formákat, amik valamilyen létező dologra emlékeztetnek minket. Erre jó példa a <${ExternalLink} href="http://fenyeslorand.hu/sziv-kod/">Szív-köd</a>, vagy az <${ExternalLink} href="http://fenyeslorand.hu/a-lelek-kod/">Embrió-köd</a>. Talán a legizgalmasabb ilyen kompozícióm az Ádám teremtése című kép. Michelangelo mesterműve a Sixtusi-kápolnából nagyon hasonló mozdulatot ragad meg, mint amit a vörös emissziós ködök mutatnak: mint két egymás felé nyúló kéz, ami mögött a kék reflexiós köd megnyugtató hátteret ad.</p>
        <p><cite> <${ExternalLink} href="http://fenyeslorand.hu/">Fényes Lóránd</a></cite></p>
    </blockquote>
    
    <h2 id="4_Keretbe_foglalas">4. Keretbe foglalás</h2>
    <p>Keretbe foglalva bármilyen unalmas kompozíciót fel lehet dobni. Csak arra kell figyelni, hogy a keret maga is harmóniában legyen a bekeretezett témával.</p>
    <p>Jó példák erre HDR fényképész barátom, <strong><${ExternalLink} href="http://hdrshooter.com">Miroslav Petrasko</a></strong> fotói az Eiffel toronyról:</p>
    <${EnlargeableFigure} fileName="kereteze-Eiffel-torony-Paris_DSC0579-web-X2.jpg" altText="Eiffel-torony keretbe foglalva" caption="Forrás: Miroslav Petrasko / HDRshooter.com" />
    <${EnlargeableFigure} fileName="keretezes-Eiffel-torony-Paris_DSC0479-web-X2.jpg" altText="Eiffel torony keretben" caption="Forrás: Miroslav Petrasko / HDRshooter.com" />
    
    <h2 id="5_Egyensuly_legyen">5. Egyensúly legyen</h2>
    <p>Ahogy az Életben, úgy egy képen is az adja a harmóniát, ha a részek közt egyensúly van. Tehát pl. ha a téma a kép jobb oldalán helyezkedik el, akkor a bal oldalon valaminek ellensúlyozni kell azt.</p>
    <${EnlargeableFigure} fileName="Vaci-Dom-ejjel.jpg" altText="Egyensúly a kompozicíóban" />
    <p>A fenti képen a váci Dómot ellensúlyozza a bal oldalon lévő lámpa. A dóm középről nézve is jól néz ki, de ott nincs benne semmi izgalmas szög:</p>
    <${EnlargeableFigure} fileName="vaci-dom-ejjel-szembol.jpg" altText="Váci Dóm éjjel, szemből" />
    <p>Az egyensúly megléte tökéletesen látható <strong><${ExternalLink} href="http://www.csikosistvan.com/">Csíkos István</a></strong> panorámáján, melyet a Vadálló-kövekről készített:</p>
    <${EnlargeableFigure} fileName="Csikos-Istvan-egyensuly.jpg" altText="Egyensúly a kompozícióban" caption="Fotó: Csíkos István / csikosistvan.com" />
    <blockquote>
        <p>Azt hiszem ez lesz az a kép amit leginkább szeretek kompozíció szempontjából.<br />
        Azt meg kell mondjam azt hiszem nálam az alkotási folyamatban sokkal több a semmi mint a valami 🙂</p>
        <p>Ami azt jelenti hogy sokkal inkább komponálok érzésre, úgy hogy az elmém eltűnik, mintsem hogy agyalnék hosszú percekig egy képen.</p>
        <p>Amikor ott vagyok, csak elengedem a dolgokat, és hagyom hogy az a valami, ami olyan intelligens, hogy minden sejtemet irányítja, összerendezi, hogy minden szívverésemet, lélegzetvételemet elintézi, részt vegyen abban a mozdulatban is amikor leteszem az állványt és nekiállok kilőni a képet.<br />
        Emiatt sokkal kevésbé elmések a képeim, nem mindig tudom miért onnan és úgy lőttem, egyszerűen csak úgy történt meg.<br />
        Ez biztosan változni fog a jövőben, már most is érzem hogy egyre világosabbak a dolgok a fotózni megyek, de a teret, az űrt mindig meg akarom hagyni majd ebben a fázisban.</p>
        <p>Ez a kép baromi sok képkockából lett összerakva, minden kocka legalább 3 expóból hiszen, nagyon dinamikus volt a fény, ugye a napot is belevettem. Persze már majdnem lement de ez még így is rengeteg fény, lent pedig sok árnyékos rész volt.</p>
        <p>28mm-es obim volt APS-C vázon, tehát közöm nem volt a nagylátószögekhez, de tudtam hogy itt arra van szükség.</p>
        <p>Így csináltam egy panorámát, és annyi mindenre figyeltem hogy egyszerűen csak az lett tudatos hogy ez most meglesz.</p>
        <p>Technikailag nem tökéletes, közel sem, a fánál nem tudtam rendesen összerakni a dolgokat, de cserébe a panoráma miatt akkora felbontást kaptam hogy simán lehet nagyban nyomtatni, és elképesztően részletgazdag.</p>
        <p>Amit szeretek ebben a képben, az az ahogy balról jobbra vezet a kép (ami nekünk természetesnek hat), a legközelebbi téma az előtérben elhelyezkedő csodálatos fa.<br />
        Innen az út jobbra vezeti a tekintetet kellemes ívben ami már egy kicsit kevésbé markáns téma, kicsit megfoghatatlanabb, de még durva anyagi téma.<br />
        Innen egy kicsit visszakanyarodva a fény veszi át a téma vezetését, ami már megfoghatatlan, csodálatos, és elvezet a végső témához ami pedig ugye a nap, illetve az a határtalannak és felfoghatatlannak tűnő energia (a képen fény) gombolyag amit az elme mér nem képes feldarabolni, felosztani, felfogni vagy megragadni.</p>
        <p>Végül oda jut a tekintet ahová a kép szeretné elvezetni.</p>
        <p>Szerintem ilyen szempontból nekem ez egy sikeres kép, még akkor is ha nem olyan a fogadtatása amilyenre számítottam.</p>
        <p>Persze mivel én ott voltam nekem nyilván többet jelent, felidéz egy élményt. <cite><${ExternalLink} href="http://www.csikosistvan.com/">Csíkos István</a></cite></p>
    </blockquote>
    
    <h2 id="Komponalasi_erzek_fejlesztese">Komponálási érzék fejlesztése</h2>
    <p>Sokaktól hallom, hogy “nem vagyok megelégedve a képeimmel, valami hiányzik”. Ennek sok oka lehet, de nagyon gyakori, hogy a kompozíció nem stimmel.</p>
    <p>A jó hír, hogy ez tudatosan fejleszthető és tanulható.</p>
    <p>Saját tapasztalatom alapján a következők biztosan segítenek:</p>
    
    <h3 id="Fenykepek_es_festmenyek_tanulmanyozasa">Fényképek és festmények tanulmányozása</h3>
    <p>Ha jó fényképekkel és festményekkel vagy bármilyen más alkotással veszem körül magam, fejlődik az esztétikai érzékem. Biztos vagyok benne, hogy még a zenehallgatás is fejleszti a képi látásmódot. A klasszikus zenék ugyanúgy vannak megkomponálva, ugyanúgy van egy ívük, mint a jó fotóknak.</p>
    <p>Ha csak Mozart kreativitásának százada átragad rám, akkor már megérte az ő műveit hallgatnom utómunkázás közben!</p>
    <p>Részemről ez a pont abból áll, hogy a neten követem a legjobb hazai és külföldi fotósok munkáit, valamint sokszor hallgatok klasszikus zenét szerkesztés közben. Itt fontos kritérium, hogy ne legyen benne ének, mert az nagyon elvonja a figyelmet.</p>
    <p>És persze, a meglátogatom a legjobb kiállításokat (kivéve a World Press Photo-t).</p>
    
    <h3 id="Fotozas_fix_objektivvel">Fotózás fix objektívvel</h3>
    <p>Az egyik legjobb fotós agyfejlesztő játék fix gyújtótávolságú objektívvel fotózni. Nem zoomolással, egy helyben állva oldani meg a feladatot, hanem a fix látószög adta keretet kihasználva gondolkodásra és mozgásra késztetni magamat.</p>
    <p>Saját sztorim:</p>
    <p>2011-ben a Kanári szigeteken jártam, hogy <${ExternalLink} href="https://tisztaegtisztafold.hu/timelapse-video-tenerife-szigeterol/">timelapse videót</a> készítsek.</p>
    <p>Ez állandó állványcipelést és rendszeres objektívcserét követelt meg. Aztán az utolsó napomon megelégeltem, hogy nem tudok csak úgy lazán kirándulni… Feltettem hát az 50mm f/1,4-s fixet, és azzal játszadoztam, hogy a tájat és az út mentén elszáradt bokrokat, füveket miként tudom lefotózni.</p>
    <div class="figures">
        <${EnlargeableFigure} fileName="Tenerife-kozel-tavol.jpg" altText="Tenerife" />
        <${EnlargeableFigure} fileName="Tenerife-fa-a-felhok-felett.jpg" altText="Tenerife" />
    </div>
    <p>Azt vettem észre, hogy egy idő után “ráállt” az agyam az adott lencse képi világára, és úgy szemlélem a környezetet, hogy mi az, amit ezzel le tudok kapni, és mi, amit nem.</p>
    <p>Egyszerűen könnyebb keresni a szögeket a tájban, hogy ha nem kell még azon is gondolkodni, hogy mennyire zoomoljak bele. Tudom, hogy ez fér bele, és ehhez keresem a szögeket.</p>
    <p>Ha pszichológiai oldalról nézem, mivel kevesebb technikai dologra kellett figyelnem, valamint magam szabta kereteket állítottam fel, megágyaztam a flow-élménynek!</p>
    <p>Igazi élvezet így fotózni! 🙂</p>
    <${EnlargeableFigure} fileName="Teide-hegy-egyensuly.jpg" altText="Teide hegy egyensuly" caption="Ezt a fotót soha nem komponáltam volna így, ha nem vagyok belekényszerítve a fix 50-s látómezejébe. Így viszont sikerült kiegyensúlyozott kompozícióba hozni a hegyet és az alatta fekvő pihenőhelyet. Így lett a Teide vulkánról az egyik kedvencem ez a kép!" />
    <p>Kedvencem erre a célra a fényerős fix 50 mm-s objektívek. Élesek, könnyűek, se nem nagy, se nem kicsi a látómező.</p>
    
    <h3 id="Rajzolas">Rajzolás</h3>
    <p>Ezt nem próbáltam ki, hanem csak Elena Shumilovától olvastam. Ő az az orosz hölgy, aki azokat varázslatos természetközeli gyerekportrékat készíti, és akiről <${ExternalLink} href="https://tisztaegtisztafold.hu/elena-shumilova-tanacsai-gyerekfotozashoz/">én is írtam itt a blogon</a>.</p>
    <${EnlargeableFigure} fileName="elena-shumilova-kutyás.jpg" altText="elena shumilova gyerekfotó" />
    <p>Ő mesélte egy interjúban, hogy minden képét előre megrajzolja. Nem festői szinten, hanem csak a formákat és kompozíciót vázolja fel, és ez segít neki a helyszínen a fotózás alatt.</p>
    <p>Az írás végét egy magamnak is szánt emlékeztetővel zárom:</p>
    <div class="tip">Kísérletezz, kísérletezz és ne érdekeljen a végeredmény!</div>
</div>`;
}