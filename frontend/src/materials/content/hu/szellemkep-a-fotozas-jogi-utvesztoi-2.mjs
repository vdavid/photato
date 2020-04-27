import {createElement} from '../../../web_modules/react.js';
import htm from '../../../web_modules/htm.js';
import {NavLink} from '../../../web_modules/react-router-dom.js';

const html = htm.bind(createElement);

// noinspection JSUnusedGlobalSymbols (This file is loaded dynamically.)
/**
 * @returns {ArticleMetadata}
 */
export function getMetadata() {
    // noinspection SpellCheckingInspection (It's in Hungarian.)
    return {
        slug: 'szellemkep-a-fotozas-jogi-utvesztoi-2',
        title: 'A fotózás jogi útvesztői, II. rész: Az engedély nélküli fotózás jogkövetkezményei és a megfelelő eljárás kérdése',
        author: 'Nagy Gergő',
        publishDate: new Date('2017-01-01'),
        publisherName: 'Szellemkep.hu',
        originalUrl: 'http://www.szellemkeponline.hu/foto/a-fotozas-jogi-utvesztoi-ii-resz-az-engedely-nelkuli-fotozas-jogkovetkezmenyei-es-a-megfelelo-eljaras-kerdese/',
        isOriginalUrlBroken: true,
    };
}

// noinspection JSUnusedGlobalSymbols (This file is loaded dynamically.)
/**
 * @returns {React.ReactElement}
 */
export default function Article() {
    // noinspection SpellCheckingInspection (It's in Hungarian.)
    return html`<div>
    <p><${NavLink} to="/external-article/szellemkep-a-fotozas-jogi-utvesztoi-1">Cikksorozatunk első részében</NavLink> a fotózás jogi szabályozásának alapjait, az engedélyköteles fotók jellemzőit, illetve az engedély megadásának módját jártuk körül. Mostani írásunkban az engedély nélküli fotózás jogkövetkezményeit mutatjuk be, és megpróbálunk útmutatást adni a megfelelő eljárásra is.</p>
    
    <h2>Mi a helyzet, ha nem kérek engedélyt a fotóhoz?</h2>
    <p>Le kell szögeznünk, hogy amennyiben embert egyénileg azonosítható módon, anélkül fotózunk, hogy ehhez engedélyt kértünk volna tőle, akkor mind a fénykép puszta elkészítése, mind esetleges felhasználása személyiségi jogsértést valósít meg. A Polgári Törvénykönyv rendszerében ez a következőkkel járhat.</p>
    <ul>
        <li>Egyrészt akinek megsértettük a képmásához fűződő jogát, kérheti, hogy a bíróság állapítsa meg ennek a jogsértésnek a tényét. Ez igencsak enyhe szankciónak tűnik, leginkább üzenetértéke van.</li>
        <li>Aztán ha közzétesszük a képet (például egy kiállítás keretében), akkor kérheti a jogsértés abbahagyását, eltiltásunkat a további jogsértéstől, a sérelmes helyzet megszüntetését (tehát hogy a képet távolítsuk el), de akár a fotó megsemmisítését is (ami valljuk be, a digitális adathordozók korában és a korlátlan sokszorosítás lehetősége folytán igencsak ellenőrizhetetlen szankció).</li>
        <li>Megint más, hogy a sérelmet szenvedett fél azt is kérheti, hogy adjunk „megfelelő elégtételt”, és ennek biztosítsunk saját költségén megfelelő nyilvánosságot. Ilyen esetekben elsősorban a sajtóban történő nyilvános bocsánatkérés képzelhető el.</li>
        <li>Az egyik legérdekesebb szankciófajta, ami fotózással megvalósított személyiségi jogsértésnél elvileg felmerülhet, hogy a sértett személy „a jogsértéssel elért vagyoni előny javára történő átengedését” is követelheti. Ez abban az esetben képzelhető el, ha annyira jó képet csinálunk, hogy például megnyerjük a World Press Photo fődíját, és az illető ezt kiszúrja a kiállításon, majd eszébe jut, hogy anno nem adott engedélyt a fényképezésre, vagy ha arra esetleg igen, a közzétételre semmiképpen. Itt a törvény abból indul ki, hogy jogalap nélkül gazdagodtunk, tehát nem volt olyan jogunk, ami alapján bármiféle anyagi nyereségre tehettünk volna szert. Épp ellenkezőleg, jogsértéssel gazdagodtunk,  ami nem helyes.</li>
        <li>A fődíjas kép ezen esetét leszámítva a sérelemdíj fizetésének terhe jelenti a legnagyobb veszélyt anyagi szempontból. A törvény szerint ezt a puszta személyiségi jogsértés (esetünkben engedély nélküli fotózás vagy közzététel) is megalapozza, a bíróság ilyenkor mérlegeli az eset össze körülményét, például, hogy maga a kép mennyire sértő, mekkora nyilvánosságot kapott, és ezáltal mekkora sérelmet okozott a fotóalanynak. Mivel a törvény új, ennek még nincs komoly gyakorlata, de a sérelemdíj álláspontom szerint  mindenképpen a súlyosabb jogsértésekre fog reagálni, ezért fotózás esetén csak a valóban sértő tartalom eredményez majd fizetési kötelezettséget.</li>
    </ul>
    <p>A fenti szankciók közül mindig a sérelmet szenvedett fél választja ki, hogy melyiket kívánja érvényesíteni velünk szemben. Elképzelhető persze, hogy a bíróságtól vagylagosan kéri ezek megállapítását, és ilyenkor az eljáró bíró döntésétől függ, hogy melyiket tartja a legalkalmasabbnak a sérelem kompenzálására. De az is lehet, hogy csak az egyikre hivatkozik, annak pedig a bíróság nem ad helyt, és más szankciót lát alkalmazhatónak. Ami biztos: ha idáig jut az ügy, akkor a sorsunk már mindenképp a bíróság kezében van, hacsak időközben meg nem egyezünk az illetővel.</p>
    
    <h2>Szóval mit tegyünk?</h2>
    <p>Ha nagyon óvatosan szeretnénk eljárni, minden esetben előre mondjuk el, hogy kik vagyunk és mit csinálunk, kérjünk engedélyt a kép elkészítésére, aztán kérdezzük meg, hogy van-e kifogása az ellen, hogy adott esetben megjelentessük valahol úgy, hogy azt akár sokan is látják majd. Mondjuk meg azt is, hogy a nyilvánosságra hozatalra előreláthatólag hol, milyen fórumon kerülhet majd sor. Ez az eljárás felel meg leginkább a törvény írott betűjének.</p>
    <p>Ennél azonban életszerűbbnek, ráadásul végső soron még mindig jogszerűnek tekinthető az a megoldás, ha előbb a képet ugyan elkészítjük, de utána érdeklődünk, hogy az illetőnek van-e kifogása a fotózás, majd az esetleges közzététel ellen. A kép készítésére az engedélyt ilyenkor utólag kaphatjuk meg tőle, ráadásul, ha rögtön a felhasználásra mond igent, ez logikusan egyben magában foglalja az arra vonatkozó utólagos hozzájárulást is, hogy a képet egyáltalán elkészíthettük. Kétségtelen, hogy az lenne a legelőnyösebb, ha a hozzájárulásról papírunk is lenne, mert ezzel előre bevédhetnénk magunkat, viszont ez nem törvényi előírás, elvileg elég a szóbeli engedély. Abban az esetben, ha ebből később mégis jogvita alakulna ki, a bíróság a fotós és az alany (minden bizonnyal egymással ellentétes) előadását, illetve az eset összes körülményeit mérlegelve jutna döntésre – ilyenkor lehet szerepe az esetleges ráutaló magatartásnak, például a pózolásnak, vagy éppen ennek hiányának. A bizonyítási teher ekkor azonban már bennünket terhel, nekünk kell ugyanis igazolni azt, hogy megkaptuk a hozzájárulást.</p>
    <p>Amellett, hogy ezt a fajta peres szituációt érdemes elkerülni, mert nehéz jól kijönni belőle, azt is szem előtt kell tartanunk, hogy abban az esetben, ha nem kapunk engedélyt (vagy nem is kértünk), csak jogellenesen fotózhatunk vagy publikálhatunk, ezzel pedig szükségszerűen kockázatot vállalunk, és számolnunk kell a fenti következményekkel. Különösen az engedély nélkül készített kép publikálása rizikós, mert ilyenkor a nyilvánosság folytán a lebukás is esélyesebb. Sohasem zárható ki ugyanis annak lehetősége, hogy elkészül a fénykép, amihez nem kaptuk meg a hozzájárulást, majd az érintett személy például egy kiállításon találkozik vele. Ha ilyenkor ezt sérelmezi, és igaza van, mert tényleg nem kértünk engedélyt, igényét a fent írtak szerint adott esetben a bíróság előtt is sikeresen érvényesítheti majd velünk szemben.</p>
    
    <h2>Az állam nem üldözi az engedély nélküli fotózást!</h2>
    <p>Ezen a ponton néhány kiegészítéssel feltétlenül élnünk kell. Az adott élethelyzet és a szabályozás logikája ugyanis szerencsére kicsit színezi az összképet.</p>
    <p>Először is nagyon fontos látni, hogy a személyiségi jogi igények alapvetően <strong>személyesen érvényesíthetők</strong>, ami azt jelenti, hogy nem kell attól tartanunk, hogy a rendőrség vagy bármilyen más hatóság egyszer csak bekopog az ajtónkon, és megbüntet bennünket. Az állam hivatalból nem üldözi az engedély nélküli fotózást. Senki nem ellenőrzi tehát, hogy egy elkészített és közzétett fotóhoz előzetesen engedélyt kértünk-e vagy sem. Legfeljebb az illető előtt bukhatunk le (gyermek esetén ez a törvényes képviselője, legtipikusabban a szülő lehet), ő jelezheti a jogsértést, és ő az, aki bíróság elé is viheti az ügyet. A törvény ugyan ügyészi fellépésre is lehetőséget biztosít, ha a jogsértés közérdeket sértene, de erre is csak akkor kerülhetne sor, ha valaki az ügyészség tudomására hozná az engedély nélküli fényképkészítés vagy a közzététel tényét; az ügyészség hivatalból nem kutat utánunk. Arról pedig, hogy jogilag mi a közérdek, oldalakat lehetne írni, és akkor se lehetne igazán konkrét választ adni rá, ezért itt nem is részletezem.</p>
    
    <h2>Konklúzió?</h2>
    <p>Végső soron mindenkinek magának kell eldöntenie, hogy fotósként milyen magatartást tanúsít. Ez vérmérséklettől, hozzáállástól, a törvény és azon keresztül mások jogainak tiszteletétől függ, de azt nem szabad elfelejtenünk, hogy a jog nem fog az engedély nélkül alkotó-publikáló fotós pártjára állni, még akkor sem, ha a művészi önkifejezés fontosságára és nemes céljára hivatkoznánk.</p>
    <p><em>(A tömegrendezvényen részt vevőkről, illetve a nyilvános közszereplés során készített, engedély nélküli fotózásról <${NavLink} to="/external-article/szellemkep-a-fotozas-jogi-utvesztoi-3">következő írásunkban</NavLink> olvashatnak.)</em></p>
</div>`;
}