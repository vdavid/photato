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
        slug: 'pixinfo-fekete-hattyu-az-utcan-avagy-mi-a-titka-a-street-photography-nek',
        title: 'Fekete hattyú az utcán – avagy mi a titka a “street photography”-nek',
        author: 'Irházy Róbert (Birdie)',
        publishDate: new Date('2012-01-03'),
        publisherName: 'Pixinfo.hu',
        originalUrl: 'https://pixinfo.com/hirek/2012/01/03/fekete-hattyu-az-utcan-avagy-mi-a-titka-a-street-photography-nek/',
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
    <p>Eric Kim blogján elemezte, mennyire nehéz, vagy könnyű a városi, vagy utcai fotózás (esetleg szóba jöhet még a szociofotózás említése is, bár az eredeti  “street photography” talán kifejezőbb bármely magyar fordításnál). Írásában Nassim Taleb-re hivatkozva fekete hattyúnak nevezte el azt az “eseményláncolatot”, ami lehetővé teszi, hogy egy érdekes témát lefotózzon. A véletlennek ugyanis sokszor nagy szerepe van egy-egy jól sikerült utcai fotográfiában (nem rendezheti újra, nem ismétlődő, nem kiszámítható), ugyanakkor hangsúlyozza, hogy saját gépünk részletes ismerete és gyors kezelése elengedhetetlen.</p>
    <p>Nem elég viszont elkészíteni a jó fotót, fel kell készülnünk a fogadtatásra is. No nem a képünk fogadtatására, hanem fotónk alanyának reakciójára. Nem ritka ugyanis a nemtetszés, vagy éppen a felháborodás. Ilyen esetben javasolja az azonnali cselekvést, az elismerést, bocsánatkérést, majd gyors távozást, mielőtt bármi komolyabb incidens történne.</p>
    <p>Szerencsére nem csak rémtörténeteket mesél, de biztat is. Hiába érezzük úgy, hogy nem vagyunk sikeresek ezen a téren, érdemes tovább próbálkozni, egyszer nekünk is eljöhet az a bizonyos fekete hattyú.</p>
    <${SimpleFigure} fileName="6090242691_5c7d496662_z.jpg" altText="Illusztráció" caption="Fotó: Kramer O’Neill" />
    <p>További tanácsok és sok-sok jó fotó <a href="http://erickimphotography.com/blog/2012/01/what-the-black-swan-unpredictability-can-teach-you-about-street-photography/#more-5219" target="_blank">Eric Kim blogján</a>.</p>
</div>`;
}