import {createElement} from '../../../web_modules/react.js';
import htm from '../../../web_modules/htm.js';
import SimpleFigure from '../../components/SimpleFigure.mjs';
const html = htm.bind(createElement);

// noinspection JSUnusedGlobalSymbols (This file is loaded dynamically.)
/**
 * @returns {ArticleMetadata}
 */
export function getMetadata() {
    // noinspection SpellCheckingInspection (It's in Hungarian.)
    return {
        slug: 'tripont-capture-one-pro-10-a-fenyelhajlas-tobbe-nem-okoz-gondot',
        title: 'Capture One Pro 10: A fényelhajlás többé nem okoz gondot',
        author: 'Bogi',
        publishDate: new Date('2017-01-27'),
        publisherName: 'Tripont',
        originalUrl: 'https://www.tripont.hu/problog/2625/capture_one_pro_10__a_fenyelhajlas_tobbe_nem_okoz_gondot',
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
    <div>A Capture One Pro 10-ben az objektívkorrekciós (Lens Correction) eszközt továbbfejlesztett formájában használhatjuk: mostantól képes a fényelhajlás kompenzációjára is. Niels V. Knudsen, a Phase One képminőség-professzora avat be az új eszköz nyújtotta lehetőségekbe.</div>
    <${SimpleFigure} fileName="capture_one_banner_024.jpg" alt="Capture One Pro 10 Banner" />
    <p>Ahogy a neve is mutatja, a fényelhajlás-kompenzációs (Lens Diffraction Compensation) eszközt arra találták ki, hogy kompenzálja az élesség és a mikrokontraszt csökkenését azoknál a képeknél, amelyek szűk rekesznyílással készültek.</p>
    <p>Ez azt jelenti, hogy mostantól, ha nagy mélységélességet szeretnél, akkor legalább egy értékkel szűkebbre veheted a rekesznyílást, mint eddig, és a képed mégsem válik életlenné.</p>
    
    <h2>De egyáltalán mi az a fényelhajlás?</h2>
    <p>Az objektívben bekövetkező fényelhajlás nem amiatt történik, mert rosszul tervezték, vagy gyártották le az objektívet: a fizika törvényei tehetnek róla. A fény elektromágneses hullámokból áll. Ha a hullámok közel mennek el egy akadály mellett, akkor meghajlanak annak mentén, és szétszóródnak. Az objektívben lévő rekesz pontosan ilyen akadály. Ha a fénynek egy objektív széles, nagy fizikai rekeszén kell átjutnia, akkor alig fog eltérülni. De ahogy csökken a rekesznyílás, szükségszerűen egyre inkább bekövetkezik a fény elhajlása. Emiatt egy teljesen pontszerű fényforrás már nem éles pontként fog látszani, hanem szétszóródva. Ez pedig egy átlagos képen életlenségként és csökkent mikrokontrasztként jelentkezik. Minél kisebb lesz a rekesz, az élesség elveszése annál inkább zavaró lesz.</p>
    
    <h2>Mikor válik láthatóvá a fényelhajlás a képen?</h2>
    <p>Az, hogy mennyire látványos a fényelhajlás negatív hatása, a fényképezőgéped képérzékelőjének pixelméretétől függ, és az éppen használt rekesztől. Az alábbi táblázat megmutatja, hogy a különböző szenzorméretű és pixelszámú fényképezőgépeknél jellemzően mikortól fogod látni az élesség csökkenését, amit a fényelhajlás okoz.</p>
    <table>
        <tbody>
            <tr><th>Fényképezőgép szenzormérete</th><th>Az a rekeszérték, amikortól a fényelhajlás befolyásolni kezdi az élességet</th></tr>
            <tr><td>1” érzékelő: 20 MP</td><td>5.6</td></tr>
            <tr><td>APS – C: 24 MP</td><td>9</td></tr>
            <tr><td>Full frame 35 mm: 42 MP</td><td>11</td></tr>
            <tr><td>Középformátum: 60MP</td><td>12</td></tr>
            <tr><td>Középformátum: 100MP</td><td>11</td></tr>
        </tbody>
    </table>
    
    <h2>Egy példa a fényelhajlásra<a href="http: //blog.phaseone.com/compensate-lost-sharpness-small-apertures/skaermbillede-2017-01-26-kl-14-11-23/"><br /></a></h2>
    <p>Szeretném, hogy lásd, mennyi élességet és kontrasztot is veszítesz a fényelhajlás miatt! A teszthez a Phase One XF 100MP kamerarendszert használtam AF 45mm objektívvel. Ez a fényképezőgép alacsony remegési móddal rendelkezik, amely az elektronikus első függöny és a beépített vibrációérzékelők segítségével elmozdulásmentes expozíciót biztosít. Azaz minden életlenség, amit az alábbi példában látsz, kizárólag a fényelhajlás miatt jött létre.</p>
    <${SimpleFigure} fileName="fenyelhajlas-kompenzalasa-Capture-One-Pro-10-1.jpg" alt="Illusztráció" caption="A fényelhajlás hatása a fotón" />
    <${SimpleFigure} fileName="fenyelhajlas-kompenzalasa-Capture-One-Pro-10-2.jpg" alt="Illusztráció" caption="200%-os zoomolás a kép közepébe" />
    <p>A képeket f/8 és f/22 közötti rekeszértékkel készítettem. Az f/8-as értéknél a kép élessége még mindig tökéletes. Az f/11-es értéknél már enyhe élességcsökkenést látni. Az életlenedés f/16-nál már nyilvánvaló, f/22-nél pedig már eltűnnek a részletek.</p>
    
    <h2>A fényelhajlás kompenzálása</h2>
    <p>A fenti példán világosan látszott, hogy ha nagyon szűkre állítod a rekeszt, akkor eltűnik az élesség és a mikrokontraszt. Ha megvizsgálod a fényelhajlás-kompenzációt a Capture One 10-ben, láthatod, hogy komplex újraélesítési folyamatot hajt végre az elveszett élesség és mikrokontraszt helyreállítása érdekében. Mondanom se kell, ha a fényelhajlás következtében bizonyos részletek teljesen elvesztek, azokat nem fogod tudni visszaállítani. De még az ilyen képeken is sokat javít a fényelhajlás-kompenzáció.</p>
    <${SimpleFigure} fileName="fenyelhajlas-kompenzalasa-Capture-One-Pro-10-3.jpg" alt="Illusztráció" caption="A Lens Tool bekapcsolt fényelhajlás-kompenzációval" />
    <${SimpleFigure} fileName="fenyelhajlas-kompenzalasa-Capture-One-Pro-10-4.jpg" alt="Illusztráció" caption="100%-os zoomolás a kép közepébe" />
    <p>A baloldali hasábban lévő képek azt mutatják, hogyan néznek ki a képek a Capture One Pro alapértelmezett beállításainak használatával. A jobboldali képeknél viszont a fényelhajlás-kompenzáció is be van kapcsolva.</p>
    <p>Ahogy a fenti példában is láthattad, a fényelhajlás-kompenzáció fantasztikus teljesítményre képes az elvesztett élesség és a makrokontraszt visszaállításában. Az f/16-os értékkel készített fotó teljesen használhatóvá vált, sőt, még az f/22-vel készült kép is egészen rendben van.</p>
    <p>Alapértelmezetten a fényelhajlás-kompenzáció ki van kapcsolva az objektívkorrekciós (Lens Correction) eszközben, mert elnyújtja a feldolgozási időt és enyhén növeli a zajt, azoknál a képeknél is, amelyeknél nincs is szükség ilyen jellegű javításra.</p>
    <h2>Használd a fényelhajlás kompenzálását, ha nagyobb mélységélességet akarsz!</h2>
    <p>Tudva, hogy a fényelhajlás befolyásolni fogja a képeim élességét, korábban az f/11 volt a legkisebb rekesz, amit a középformátumú képeimhez használtam. Most viszont az új fényelhajlás-kompenzálás használatával ennél szűkebbre is merem venni a rekeszt, ha nagyobb mélységélességre van szükségem.</p>
    <${SimpleFigure} fileName="fenyelhajlas-kompenzalasa-Capture-One-Pro-10-5.jpg" alt="Illusztráció" />
    <p>Amikor ezt a képet elkészítettem a Phase One XF 100MP kamerarendszerrel és Schneider Kreuznach 55mm LS f/2.8 optikával, akkor már előre gondoltam a fényelhajlás-kompenzáció lehetőségére, és úgy döntöttem, hogy f/14-re leviszem a rekeszt, hogy szép nagy mélységélességet kapjak.</p>
    <${SimpleFigure} fileName="fenyelhajlas-kompenzalasa-Capture-One-Pro-10-6.jpg" alt="Illusztráció" caption="A kis mélységélesség hatásai." />
    <p>f/11-gyel ugyanis nem tudtam elérni, hogy a világítótorony és az előtér is egyszerre éles legyen. A két felső képen 100%-os zoomolással láthatod ugyanazon a fotón, hogy a világítótornyon tökéletes a fókusz, az előtér viszont elveszett. Második körben kicsit közelebb hoztam a fókuszt, akkor viszont a világítótorony lett életlen.</p>
    <${SimpleFigure} fileName="fenyelhajlas-kompenzalasa-Capture-One-Pro-10-7.jpg" alt="Illusztráció" />
    <p>f/14-gyel már mindkettőhöz elég lett a mélységélesség a képen. A Lens Toolba épített fényelhajlás-kompenzáció új lehetőségével pedig könnyedén visszanyerhettem az elvesztett élességet.</p>
</div>`;
}