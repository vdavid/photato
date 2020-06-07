import React from '../../../web_modules/react.js';
import SimpleFigure from '../../components/SimpleFigure.mjs';

// noinspection JSUnusedGlobalSymbols (This file is loaded dynamically.)
/**
 * @returns {ArticleMetadata}
 */
export function getMetadata() {
    // noinspection SpellCheckingInspection (It's in Hungarian.)
    return {
        slug: 'onlinefototanfolyam-mi-a-gyujtotavolsag-szorzo',
        title: 'Mi a gyújtótávolság szorzó?',
        author: 'onlinefototanfolyam.hu',
        publishDate: new Date('2016-10-18'),
        publisherName: 'onlinefototanfolyam.hu',
        originalUrl: 'https://www.onlinefototanfolyam.hu/aktualis-cikkek/mi-a-gyujtotavolsag-szorzo-/47545/',
        isOriginalUrlBroken: false,
    };
}

// noinspection JSUnusedGlobalSymbols (This file is loaded dynamically.)
/**
 * @returns {React.ReactElement}
 */
export default function Article() {
    // noinspection SpellCheckingInspection (It's in Hungarian.)
    return <>
        <p>Nehéz téma és sok a visszatérő kérdés:</p>
        <ul>
            <li>Mi az a gyújtótávolság szorzó?</li>
            <li>Ha nem Full frame szenzorméretű fényképezőgépünk van, akkor ahhoz, hogy megkapjuk az objektívek valós gyújtótávolságát meg kell szoroznunk valamennyivel? Mennyivel is?</li>
        </ul>
        <p>Ezeken kívül sok furcsa kérdés merül fel, sajnos jogosan. Öntsünk tiszta vizet a pohárba.</p>
        <p>
            <em>(Az érthetőség kedvéért nem fejtek ki mindent szakszavakkal, megpróbálok egyszerűsíteni, úgy leírni ezt a cikket, hogy könnyen emészthető legyen. Bár a téma nem az.)</em>
        </p>

        <h2>Miért van egyáltalán a gyújtótávolság szorzó?</h2>
        <p>Mielőtt a gyújtótávolság szorzó magyarázatába belekezdenék, azt érdemes tisztázni, hogy miért kell nekünk a digitális fényképezőgépek korában egyáltalán ilyenekkel számolnunk? Miért nem találnak már ki erre valami egyszerű megoldást, szabványt?</p>
        <p>A fényképezőgép gyártók mindig haladnak valamilyen trend irányába, és próbálják valami újdonsággal megnyerni a vásárlókat. Az egyre kisebb gépek készítése nem megy ki a divatból, gondoljunk csak bele a MILC (tükör nélküli) gépek előretörésére az utóbbi pár évben. <br/>
            Az egyre kisebb fényképezőgépekhez pedig egyre kisebb objektíveket és <strong>egyre kisebb szenzort</strong> kell/lehet készíteni.
        </p>
        <p>Így új vásárlókat lehet megnyerni, egy piaci rést betölteni, gazdaságosabban lehet fényképezőgépeket gyártani, stb.</p>

        <h2>A gyújtótávolság:</h2>
        <p>Ahhoz, hogy megértsük ezt az egészet, kell egy kis kitérő a gyújtótávolság (és a látószög/képszög) felé. Nézzük meg mit értünk normál gyújtótávolságú alap objektíven, nagylátószögű és tele objektíven:</p>
        <ul>
            <li>Az 50 mm gyújtótávolságú optikát hívjuk alap objektívnek. (Ez hasonlít legjobban az emberi szem látószögére, ezért ezekkel az optikákkal készült képek természetes hatást keltenek.)</li>
        </ul>
        <SimpleFigure fileName="1476826919_600x500.jpg" altText="Illusztráció"/>
        <ul>
            <li>Azokat az optikákat, amelyeknek a gyújtótávolsága 50 mm-nél kisebb, nagylátószögű objektíveknek nevezzük. Az 50 mm-es gyújtótávolságú objektívekhez képest ezek többet láttatnak ugyanabból a tájból. Nagyobb a látószögük.</li>
        </ul>
        <SimpleFigure fileName="1476826923_600x500.jpg" altText="Illusztráció"/>
        <ul>
            <li>Azokat az optikákat, amelyeknek a gyújtótávolsága 50 mm-nél nagyobb, teleobjektíveknek nevezzük. Ezek az 50 mm-es gyújtótávolságú objektívekhez képest kevesebbet láttatnak ugyanabból a tájból. Kisebb a látószögük.</li>
        </ul>
        <SimpleFigure fileName="1476826928_600x500.jpg" altText="Illusztráció"/>

        <h2>24x36 mm - Full Frame</h2>
        <p>Kezdjük az elején, menjünk vissza időben a negatívra dolgozó kisfilmes (más néven 135-ös, vagy 35 mm-es) fényképezőgépekhez. Az amatőr, a tükörreflexes és a professzionális fényképezőgépek körében is a 24x36 mm-es negatív film volt a legelterjedtebb, vagyis erre a filmre dolgoztak a fényképezőgépek. <br/>
            (A 24x36 mm egy negatív kocka méretét jelenti.) Az objektívek pedig ehhez a film mérethez készültek!
        </p>
        <p>A lényeg számunkra, hogy ez a negatív film méret volt a legelterjedtebb és ehhez a szabványhoz fejlesztették az objektíveket is!</p>
        <p>Sőt! Ez a méret, vagy ez a szabvány annyira elterjedt volt, hogy a digitális fényképezőgépek megjelenésével, majd elterjedésével a digitális fényképezőgépek szenzor méretét (és az ezekhez a fényképezőgépekhez készült objektívek gyújtótávolságát) még ma is ehhez viszonyítjuk!</p>
        <p>E szerint a szabvány szerint megszoktuk és megtanultuk például, hogy mit jelent az alap objektív, milyen gyújtótávolságú objektívet válasszunk ha nagylátószögű képet szeretnénk készíteni, és milyen gyújtótávolságú objektívet használjunk egy portré elkészítéséhez.</p>

        <h2>Eltérő szenzorméretek:</h2>
        <p>A digitális fényképezőgépek gyártása sok újdonságot hozott. Például a számunkra most fontos szenzorméretek különbségét. Kisebb fényképezőgéphez kisebb méretű szenzort lehet készíteni, ami számunkra a gondot okozza! Vagyis, ha ugyanazt az objektívet különböző szenzorméretű fényképezőgépen használjuk, akkor más-más látószögű képet kapunk. <br/>
            (Ennek azért van jelentősége, mert a Full Frame szenzorméretű fényképezőgéphez készült objektíveket ugyanazon márkán belül, tudjuk kisebb, például APS-C szenzorméretű fényképezőgépen is használni.)
        </p>

        <h2>A gyújtótávolság szorzó:</h2>
        <p>Amikor egy digitális fényképezőgép szenzor mérete megegyezik a 24x36 mm negatív kocka méretével (ezt hívjuk ma Full-Frame-nek), akkor minden marad a megszokottban, nincs gyújtótávolság szorzó. <br/>
            - Például egy 50 mm-es alap objektív mindkét fényképezőgépen ugyanúgy fog viselkedni.
        </p>
        <p>Ha a digitális fényképezőgépünk kisebb, APS-C méretű (16x23 mm) szenzorral rendelkezik, akkor ugyanannál az 50 mm-es objektívnél már változik a gyújtótávolság és a látószög.</p>
        <p>Miért? Mert az objektívek eredetileg 24x36 mm-es területre vetítették a képet. Az APS-C szenzoroknak meg csak 16x23 mm-es a mérete. Tehát nincs kihasználva az objektívek teljes képalkotó képessége.</p>
        <p>Egyszerűbben: az objektív jóval nagyobb körben vetít képet a kisebb szenzorra, mint annak a mérete. Tehát ha a 24x36 mm-es szenzortól kisebb méretű szenzor van a fényképezőgépünkben, akkor veszítünk a látószögből. Olyan mintha nagyobb gyújtótávolságú objektívet használnánk.</p>
        <SimpleFigure fileName="1476828699_600x500.jpg" altText="Illusztráció"/>

        <h2>
            <strong>FONTOS:</strong> Az előbb említett példa ugyanarra a objektívre vonatkozik két különböző szenzorméretű
        </h2>
        <p>Azért, hogy jobban alkalmazkodjunk az eltérő szenzorméretű fényképezőgépeken található gyújtótávolság jelöléshez, <br/>
            vagyis azért, hogy átszámolva tudjuk mihez hasonlítani a kisebb szenzorméretű fényképezőgépek objektíveinek gyújtótávolságát a kisfilmes fényképezőgépekhez képest, itt egy táblázat néhány gyújtótávolság szorzóról.
        </p>
        <SimpleFigure fileName="1476830167_600x500.jpg" altText="Illusztráció"/>

        <h2>Példa 1.:</h2>
        <p>Nézzünk meg egy-két példát, hogy biztosan érthető legyen:</p>
        <p>Digitális fényképezőgépet szeretnénk vásárolni. Az a gép, amit kinéztük magunknak APS-C szenzorméretű, hozzá a gyári csomagban 18-55 mm-es zoom objektívet adnak.</p>
        <p>Mekkora gyújtótávolságú objektívnek felelne meg ez egy kisfilmes/Full Frame fényképezőgépen?</p>
        <p>A gyújtótávolság szorzó az APS-C szenzorméretű fényképezőgépeknél 1,5. Így a 18-55 mm gyújtótávolságú objektív kb. 28-85 mm-nek (pontosan 27-82,5) felel meg.</p>

        <h2>Példa 2.:</h2>
        <p>Mikro 4/3-os szenzorméretű fényképezőgéphez keresünk nagy zoom átfogású objektívet. Olyat, ami a kisfilmes gépeknél 70-200 mm-nek felel meg.</p>
        <p>Mekkora gyújtótávolságú objektívet keressünk?</p>
        <p>A gyújtótávolság szorzó a Mikro 4/3 szenzorméretű fényképezőgépeknél 2. Így 35-100 mm-es objektívet kell keresnünk.</p>
    </>;
}