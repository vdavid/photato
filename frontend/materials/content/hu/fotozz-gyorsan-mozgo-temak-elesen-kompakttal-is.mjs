import {createElement} from '../../../web_modules/react.js';
import htm from '../../../web_modules/htm.js';
import EnlargeableFigure from '../../components/EnlargeableFigure.mjs';
const html = htm.bind(createElement);

// noinspection JSUnusedGlobalSymbols (This file is loaded dynamically.)
/**
 * @returns {ArticleMetadata}
 */
export function getMetadata() {
    // noinspection SpellCheckingInspection (It's in Hungarian.)
    return {
        slug: 'fotozz-gyorsan-mozgo-temak-elesen-kompakttal-is',
        title: 'Gyorsan mozgó témák élesen – kompakttal is',
        author: 'SchRay',
        publishDate: new Date('2007-06-21'),
        publisherName: 'Fotozz.hu',
        originalUrl: 'http://fotozz.hu/cikket_megmutat?cikk_ID=83',
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
    <p>A digitális gépet használók, az egyre fejlettebb technológiák ellenére, előbb vagy utóbb, de olyan helyzetben találhatják magukat ahol kénytelenek kijelenteni: "ezt bizony nem tudom jól lefényképezni". S nem egyszer sok-sok életlen kép után azzal az érzéssel mennek haza,hogy nem rajtuk, hanem a profi "sportfotós" felszerelésük hiányán múlt a siker. A fotozz. hu-n már napvilágot látott egy a sportfotózással foglalkozó cikk, amelyben bölcs27 említést tesz sok fontos körülményről. A két cikk között lesz egy-két átfedés, itt viszont inkább a technikai fogásokra térnék ki jobban, a teljesen kezdők számára is közérthető formában.</p>
    <p>Bemozdult, életlen, lemaradt a képről... <br />
    A kompakt, bridge, sőt gyakran a DSLR gépet használók körében is klasszikus kulcsszavak, és igazolják a kályhacsővel kivonuló sportfotósokat. Tény, hogy egy remek felszerelés sokban hozzájárul a jól sikerült képekhez, de ez nem feltétlenül jelent milliós teleobjektíveket! <br />
    Egy-két apró fogás, és a már adott felszerelés alapos ismeretével bárki sikereket érhet el!</p>
    
    <h2>1. Miért nem sikerül?</h2>
    <p>A legfontosabb, hogy nem szabad már a kezdet kezdetén elkönyvelni, hogy úgysem fog menni. Láttam már olyat, hogy egy tehetséges amatőr egy sporteseményen egyszerűen letagadta, hogy nála van a gépe, mert nem érzett elég bátorságot a profik mellett előhúzni. Sajnálatos. Ezeket a rosszul rögzült reflexeket le kell építeni. Ebben segíthet, ha könnyebb körülményekkel kezdünk. Egy kis önbizalom növeléshez nem árt sok-sok napfény, és a motocross verseny amatőr, kevésbé vad korcsoportja! :D</p>
    
    <h3>1.1. Bemozdult...</h3>
    <p>A kompakt gépek objektívei kisebb fényerejűek, míg a bridgek egy fokkal jobbak ebben. (sőt rengeteg középkategóriás gépnek jobb a fényereje, mint a belépő tükörreflexesek kitobjektívének. ) <br />
    Kisebb fényerő, és gyengébb megvilágítás esetén a fénymérő automatika hosszabb záridőt állít a világos képek érdekében. Így megnő a kezünk remegéséből adódó bemozdulás veszélye. Ezt csak fokozza, ha a nagy távolság miatt jobban ráközelítünk a témára, hiszen ekkor ugyanahhoz a szögelforduláshoz nagyobb sugár, ergo nagyobb elmozdulás tartozik (ez svenkelésnél előny lehet, ld. később) Általánosan elfogadott vélemény, hogy a gyújtótávolság reciproka még elég rövid záridő a biztonságos exponáláshoz. (például 10x-s zoom esetén a gyújtótávolság 35mm-re átszámolva 350mm -10x35- tehát a leghosszabb záridő 1/350sec. A kompakt gépek érzékelője más és más méretű, ezért mindet átszámolják nagyításba, ("zoom") vagy a filmes 35mm-es átmérőre. Az optimális záridő a zoom szorozva 35-el)</p>
    <p>Egy gyengén megvilágított teremben ez a biztonságos záridő sokszor kevés. Szerencsére ma már sok gépben található képstabilizátor. Ez egy lencsét (lencsecsoportot), vagy az érzékelőt mozgatva próbálja kiküszöbölni az elmozdulást. Az újabb modelleken ez egyre jobb hatékonysággal funkcionál, pl. 1/350sec helyett akár 1/150sec-et, vagy még hosszabb záridőt is használhatunk álló témáknál. Mozgó dolgok esetén azonban a környezet, és ami nem mozog éles lehet, de többi, amit el akarunk kapni elmosódik, mozgása nyomot hagy a képen. Ezt csak a záridő rövidítésével lehet leküzdeni. <br />
    Ha túl kevés a fény próbálkozhatunk az érzékenység növelésével. Sajnos ez kompromisszumokkal jár. Előnye, hogy pl. ISO100 helyett ISO200-at használva a záridőnk 1/150 helyett 1/300sec lehet, hátránya viszont a magasabb érzékenységek esetén a részletgazdagság csökkenése, és a kép erős szemcsésedése, zajosodása. Mindenki tapasztalja ki a saját gépén, hogy milyen érzékenység az, ami számára még élvezhető képeket ad, ez a fejlettebb modellek esetén magasabb érték, de régebbi gépek sajnos 100, 200 fölött már nem adnak elfogadható eredményt.</p>
    
    <h3>1.2. Életlen...</h3>
    <p>A kompaktoknál az exponáló gomb teljes lenyomása után még akár 1-2sec is eltelhet addig, amíg a gép exponál. Ez azért van, mert a gomb lenyomásakor elkezd a gép élességet állítani, ami egyrészt a lassú feldolgozó rendszer, és a még lassabb mozgató mechanika miatt sok időt vesz igénybe. Ez sokszor okoz problémát, sokakban kialakulhat az érzés, hogy ekkora késés mellett lehetetlen elkapni a megfelelő pillanatot. Erre a fejlesztők is hamar rájöttek, és átvettek a filmes világból ismert megoldást, a kétfázisú exponálógombot. Ez azt jelenti, hogy a gombot félig lenyomva a gép már elkezd élességet állítani, és ha így tartjuk, akkor rögzíti a mért értékeket (többnyire a fénymérést is-ez az AF/AE lock) és bármerre is fordulunk a géppel nem fogja megváltoztatni mindaddig, amíg el nem engedjük a gombot vagy le nem nyomjuk. Utóbbi esetben a beállított értékkel süti el a kamerát, tehát nem kell kivárni az élességállítást, amivel sok időt nyerünk, az újabb gépeken gyakorlatilag azonnal megtörténik az expozíció. Ez a funkció MINDEN gépben benne kell legyen!</p>
    <p>Az életlenség egyik fő oka, hogy a fókusz rögzítése után a téma (mivel mozog) elhagyhatja az általunk beállított éles sávot. Ha mozgó tárgy az optikai tengelyre merőlegesen mozog, akkor könnyebb dolgunk van, mert egy jelentős szakaszon nem változik a tőlünk vett távolsága. A legnehezebb eset az, amikor pontosan felénk közeledik, vagy épp távolodik a téma, ilyenkor a legnehezebb belőni a pontos élességet. <br />
    Sok bridge gép kínál követő funkciót (AF-C, AE SERVO stb.), amikor az élesség rögzítése nélkül folyamatosan fókuszál. Ezek sajnos gyakorlatban nem túl működőképesek, mert lassúak. Körülbelül egy sétáló embert képesek követni, bár lehetnek eltérések, a drágább új gépek talán gyorsabbak. Gyakran hátrányunkra is lehet, mert ha a mérőmezőt (a legtöbb esetben középen van) nem a témára tartjuk, akár csak egy pillanatig is, akkor a gép rögtön átugrik a háttérre, vagy az előtérre, és ezzel időt veszthetünk.</p>
    <p>A manuális fókusz több gépben adott, viszont gyakorlati haszna nincs. (nemcsak mozgó témáknál.) Mivel az átnézeti keresőben nem kapunk információt, az élességről, az EVF és az LCD pedig általában túl kicsi felbontású a precíz beállításhoz, a funkció az esetek többségében életlen, vagy lágy, hellyel közel éles képekhez vezet, és lassú is. (DSLR megint előnyben)</p>
    
    <h2>2. Tippek, trükkök, fogások</h2>
    <p>A fenti leírás sokakat elkeseríthet, ez bizony nem fog menni, túl magasak a korlátok. Csak elgondolkodtatás végett írom le, h a profik gyakran használnak 400, vagy 800mm-es teleobjektíveket, ezek fényereje pedig nem feltétlenül nagyobb, mint a jól bevált kompakt gépünké (2, 8 jónak számít, az átlagos 4, vagy kisebb), és a hosszabb gyújtótávolság rövidebb záridőt igényel, ami csak nehezít a dolgunkon, főleg, hogy ISO1600-on vagy 3200-on még a "profi" gépek sem adnak feltétlenül megfelelő képeket. Előnyük annyi, hogy sokkal gyorsabban állnak rá a témára, és gyors tárgyakat is tudnak követni... Ha jól használják!</p>
    
    <h3>2.1. A kivárásos technika</h3>
    <p>Ha van elég fény az expozícióhoz, és a mozgó tárgyunk kiszámítható pályán mozog, az AF/AE rögzítés (ld. Feljebb) segítségével egy lövéssel elkaphatjuk a megfelelő pillanatot. <br />
    Keressük meg azt a pontját a mozgásnak, amikor a téma elérhető távolságban van, és úgy véljük, hogy az adott helyzetben jól fog mutatni. Mielőtt ide érne, állítsuk az élességet erre a pontra (segíthet egy kontrasztos tárgy ugyanebben a távolságban), ne feledjük, hogy a fénymérést is rögzítjük ezzel, ha szükséges, hát igazítsuk a helyzethez! Ezek után a már ismertetett módon tartsuk lenyomva félig az exponálógombot, és szépen keressük meg a témánkat. Ekkor még életlennek fogjuk látni a képernyőn ez ne zavarjon meg, szépen kövessük végig a mozgását, és amikor arra a pontra érkezik ahova előzőleg élesítettünk katt!!! Egy kis gyakorlással remek képeket lehet így készíteni. A téma követése a keresőben vagy az LCD-n nagyon fontos, mert így folyamatosan a képmezőben tarthatjuk és nem fog lecsúszni a képről, ezek mellett kontrollálhatjuk a kompozíciót. Előfordulhat, hogy különféle "intelligens" AF rendszerek a mozgást érzékelve újra elkezdenek fókuszálni, ezért ilyenkor szabaduljunk meg tőlük, állítsuk "CENTER" "ONE SHOT FOCUS" üzemmódba, vagy arra, ami gépünkön ennek felel meg (a lehető legfapadosabb AF).</p>
    <${EnlargeableFigure} fileName="347.jpg" thumbnailFileName="347 (1).jpg" altText="Kivárásos technikával - Fuji S5500" caption="Kivárásos technikával - Fuji S5500" />
    
    <h3>2.2. Ha elég gyors a követő AF</h3>
    <p>A követés itt is sorsdöntő! Folyamatosan tartsuk a témán a mérőmezőt, mert különben elugrik és elkéshetünk. A megfelelő pillanatban, ha van lehetőség, akasszuk meg a fókuszálást, és villámgyors reagálással helyezzük oda ahol a képen viszontlátni, szeretnénk.(erre a tükörreflexes gépeknél egy külön gomb szolgál, amit nyomva tartva szünetel a fókuszálás, talán fejlettebb bridge gépekben is van már ilyen lehetőség) A módszer nem túl hatékony, viszont nem kiszámítható pályán mozgó témák esetén (pl. foci) nincs sok más választásunk. Itt fennállhat a 10 képből 1 éles tendencia, ez az ügyességünkön és a szerencsénken múlik, de ha már egy éles, akkor megéri. Ha megakasztáskor bizonytalanak vagyunk, vagy nincs lehetőségünk rá, akkor érdemes kevésbé ráközelítve elkészíteni a képet, az elérhető legnagyobb felbontásban, amit utólag szabadon, vágással oda orientálhatunk, ahova akarunk.</p>
    <${EnlargeableFigure} fileName="348.jpg" thumbnailFileName="348 (1).jpg" altText="Követéssel - Fuji S5500" caption="Követéssel - Fuji S5500" />
    
    <h3>2.3. A Svenkelés</h3>
    <p>Igen, nagybetűvel írtam, szándékosan, mert talán ez a leghatékonyabb, leglátványosabb, ugyanakkor legnehezebb technika és én ezt preferálom a legjobban. <br />
    A szakzsargon svenkelés szót a mozis világból vette át, ott a film közben a vágás nélküli kameraforgást jelenti. <br />
    Gyakorlatilag erről van szó fotózás esetén is. Szándékosan hosszabb záridőt alkalmazunk és tárgy pályáján mozgatva a fényképezőgépet elhúzzuk a képet exponálás közben, ezzel teljesen elmosva a hátteret. Ha minden jól megy, akkor a téma éles marad, és a háttér pedig nagyon látványosan elmosódik. A definícióból érezhető, hogy milyen körülményes művelet. Az előnye az, hogy kevés fény esetén is megpróbálkozhatunk vele, hiszen itt feltétel a relatíve hosszabb záridő. Az is látszik, hogy csak akkor hatékony, ha a tárgy legalább egy rövid ideig követhető pályán halad, foci, jégkorong, tánc esetén ezek ritka pillanatok. Újabb probléma léphet fel, ha a kiszemelt célpont nem csak a helyét változtatja, hanem a helyzetét is. Ilyen lehet egy vágtató ló, vagy egyszerűen egy futó ember. Ezekben az esetekben a láb, és a többi végtag, az arc is mozoghat az expozíció ideje alatt, ezért meg kell keresni azt a leghosszabb záridőt, amikor ezek elmosódása még elfogadható. Járművek esetén egyértelműen könnyebb a helyzet, hiszen max. a kerekek mosódnak el, ami nem is baj. Rövidebb gyújtótávolságoknál (kisebb, 3-4x-es zoom) feltétlen hosszabb záridőt kell állítani, és közelebb menni. Ha rendelkezünk hosszabb teleobjektívekkel (8-12x) akkor érdemes távolabbról, kihasználni a hosszú gyújtótávolságot. A nagyobb zoom egyik jótékony hatása az, hogy a kisebb mélységélesség jól kiemeli a témát a háttérből, a másik pedig, hogy a már említett nagyobb sugár miatt, ugyanaz a szögelfordulás nagyobb elmozdulásban mutatkozik meg. Különösen hosszú teleobjektívekkel lehetőségünk nyílik a fent említett helyzetváltoztató mozgások éles rögzítésére, hiszen egy jól svenkelt képhez rövidebb záridő is elég lesz, amivel viszont nem biztos, hogy komolyan meglátszik majd a pl. a ló lábainak mozgása vágta közben. <br />
    A pihenő képstabilizátor svenkeléskor nagyon fontos eszköz lehet. A legtöbb gép két üzemmódban stabilizálhatja a képet. Az első statikus témákhoz való, két tengelyen rögzít, így kiküszöböli a függőleges és vízszintes mozgásokat is. A második mód kifejezetten mozgó dolgokhoz ajánlott, ugyanis az egyik tengelyt szabadon hagyja. Mindenki kipróbálhatja, ha 1-es üzemmódban próbál mozgást fotózni, akkor a képstabilizátor visszarántja a témát. A 2-es üzemmód viszont igazodik a követés irányához, és csak erre a tengelyre stabilizálja a képet. Tehát ha vízszintesen követünk valamit, a stabilizátor csak a függőleges eltéréseket küszöböli ki, és nagyobb eséllyel sikerül élesre venni a témát. <br />
    A svenkelés sok türelmet és gyakorlást igényel, érdemes a fent említett kivárásos módszerrel párosítani, hogy pontos élességünk legyen, (csak itt egy pont helyett, egy pályaszakaszt kell választani) és itt is nagyon fontos, hogy folyton a képmezőben tartsuk a témát, hogy semmi se maradjon le.</p>
    <div class="figures">
        <${EnlargeableFigure} fileName="349.jpg" thumbnailFileName="349 (1).jpg" altText="Majdnem sikerült svenkelés..." caption="Majdnem sikerült svenkelés..." />
        <${EnlargeableFigure} fileName="350.jpg" thumbnailFileName="350 (1).jpg" altText="Kis gyakorlás után..." caption="Kis gyakorlás után..." />
        <${EnlargeableFigure} fileName="351.jpg" thumbnailFileName="351 (1).jpg" altText="Példa arra, hogy miért nehéz embereket svenkeléssel fotózni" caption="Példa arra, hogy miért nehéz embereket svenkeléssel fotózni" />
    </div>
    
    <h3>2.4. Sorozatfelvétel</h3>
    <p>Körülbelül egymillió forint azoknak a DSLR-knek az ára, amik egy másodperc alatt 10 kép készítenek. Emberileg is elérhető áron 3kép/sec-nál többet nem fogunk kapni. Kis tapasztalatszerzés erejéig érdemes kipróbálni, de hamar kiderül majd, hogy nagyon behatárolt területen lehet csak hasznos. Egy autó esetén nem biztos, hogy nagy szükségünk van több képre az adott pillanatról, mert nem ad sok különbséget, viszont egy táncos, vagy díjugrató ló mozgásánál már érdekes lehet két fázis közötti átmenet. A hátrány az, hogy ezen a sebességen még nem igazán kontrollálható, hogy pontosan mi legyen a képen. Ha nagyon gyors a mozgás a 3kép/sec kevés lesz, és könnyen lemaradhatunk egyik fontos pillanatról, mert a három kép közül egyikre se került rá, épp az, amelyik éles lett volna. Persze sok gyakorlással lehet adaptálódni az időközökhöz, mindenki döntse el maga, hogy szeretne-e több képet egy fázisból, és ezekkel megtölteni a memóriakártyáját, vagy inkább egyszeri éles pillanatokra hajt! ;)</p>
    <${EnlargeableFigure} fileName="352.jpg" thumbnailFileName="352 (1).jpg" altText="Ez egy nagyon régi nagyon alap kis kompakt géppel lett elkészít" caption="Ez egy nagyon régi nagyon alap kis kompakt géppel lett elkészít" />
    
    <h3>2.5. Egyéb kreatív módszerek...</h3>
    <p>Itt aztán nyugodtan szabadon engedheti mindenki a fantáziáját! A teljesség igénye nélkül pár gondolat: Ha van állványunk pl. a környezet élesre vétele mellett ábrázolhatjuk a mozgást elmosódva is, ki kell puhatolni, hogy ez mikor ad értékelhető eredményt. <br />
    Másik lehetőség, ha elég közel tudunk menni, és szabad vakuzni (erős vaku kell hozzá) az elmosódás és az éles téma kombinálása. Erősen ajánlott a manuális üzemmód, és sok-sok gyakorlás. A lényeg, hogy hosszabb, mondjuk a környezet megvilágításához elegendő záridőt alkalmazunk, amellett, hogy az előtérben lévő témára pedig rávakuzunk. Fontos az expozíció precíz beállítása, ez többnyire a fénymérőnek nem sikerül. Nyugodtan meglódíthatjuk kezünkben a gépet, akár oldalra is fordíthatjuk, mozgassuk kedvünkre, és a vakut pedig állítsuk hátsó szinkronra. Ez fontos, ugyanis az elmosódó tárgy nyoma hátsó szinkron esetén a vakuval megfagyasztott tárgy mögött fog elhelyezkedni, míg első redőnyre szinkronizálva az elmosódás a kivilágított téma elé kerül, így kevésbé lesz éles és látványos.</p>
    <div class="figures">
        <${EnlargeableFigure} fileName="354.jpg" thumbnailFileName="354 (1).jpg" altText="Egy másik megközelítés..." caption="Egy másik megközelítés..." />
        <${EnlargeableFigure} fileName="355.jpg" thumbnailFileName="355 (1).jpg" altText="Hosszú szinkronnal - Nikon D100" caption="Hosszú szinkronnal - Nikon D100" />
    </div>
    <p>Ha semmiképp sem megy, akkor se tegyük el a fényképezőgépet, hiszen az ilyen események helyszíne is lehet érdekes téma, a nézők, vagy épp egy átfogó kép a pályáról! ;)</p>
    <${EnlargeableFigure} fileName="353.jpg" thumbnailFileName="353 (1).jpg" altText="Ha más nem megy, hát kapjuk le a környéket!" caption="Ha más nem megy, hát kapjuk le a környéket!" />
    <p>Ajánlom a már fent említett, bölcs27 cikkét a sportfotózásról és Bedicsand-ét az alapfogalmak áttekintéséhez (A fény, az ISO, a blende, a zársebesség, a gyújtótávolság...) ha valami nem volt egészen világos.Remélem hasznos tanácsokkal szolgálhattam, elnézést a terjengősségért és az esetleges hibákért!</p>
    <p>Sok sikert, jó fényeket!</p>
    <p>SchRay</p>
</div>`;
}