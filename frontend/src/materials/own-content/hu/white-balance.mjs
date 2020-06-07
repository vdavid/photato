import React from '../../../web_modules/react.js';
import FullWidthLocalImage from '../../../challenges/components/FullWidthLocalImage.mjs';
import ExternalLink from '../../components/ExternalLink.mjs';
import {config} from '../../../config.mjs';

// noinspection JSUnusedGlobalSymbols (This file is loaded dynamically.)
/**
 * @returns {ArticleMetadata}
 */
export function getMetadata() {
    // noinspection SpellCheckingInspection (It's in Hungarian.)
    return {
        slug: 'feheregyensuly',
        title: 'Fehéegyensúly',
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

        <p><strong>Linkek további infókra, tippekre</strong></p>
        <ul>
            <li>A studioeszkozok.hu cikke <ExternalLink href="https://studioeszkozok.hu/blog/feheregyensuly-es-szinhomerseklet-a-digitalis-fotoknal">a fehéregyensúlyról</ExternalLink>.</li>
            <li>A fotozasblog.hu cikke szintén <ExternalLink href="https://fotozasblog.hu/feher-egyensuly-beallitas-viszlat-sarga-fotok/">a fehéregyensúlyról</ExternalLink></li>
        </ul>

        <p>Most, hogy ezt a cikket elolvastad, ajánljuk a <a href={config.baseUrl + '/article/csendelet-tippek'}>Csendélet-fotózás tippek</a>et a gyakorláshoz.</p>
    </>;
}
