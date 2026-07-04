import React from '../../../web_modules/react.js';
import ExternalLink from '../../components/ExternalLink.mjs';

// noinspection JSUnusedGlobalSymbols (This file is loaded dynamically.)
/**
 * @returns {ArticleMetadata}
 */
export function getMetadata() {
    // noinspection SpellCheckingInspection (It's in Hungarian.)
    return {
        slug: 'week1-foodie-shots',
        title: 'Gasztrofotó tippek',
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
        <p>Hogy mikor jó egy gasztrofotó? Ha aki látja, legszívesebben azonnal beleharapna az ételbe.</p>

        <p>Segítségképp itt a 8 legjobb tippünk:</p>

        <ol>
            <li>
                <strong>Tálalj.</strong> Válaszd ki a megfelelő tányért, amire/amibe az étel kerül. Jól gondold meg a különböző összetevők sorrendjét és a díszítést. Erre leginkább akkor van lehetőséged, ha te készíted/tálalod az ételt, de ha már tálalva van, az se baj, még van hátra 7 tipp.
            </li>
            <li>
                <strong>Dekoráld az ételt.</strong> Magvak, levelek, szószok, apró gyümölcsök nagyon sokat tudnak dobni az összhatáson. Próbálj kontrasztos színpárosítást választani (sárga-zöld, piros-sárga, rózsaszín-fekete)
            </li>
            <li>
                <strong>Figyelj a háttérre.</strong> Ez jelentheti azt, hogy elpakolsz a fotózott tárgy környékéről, de kiegészítheted a képet evőeszközökkel, szalvétával, itallal, konyharuhával, egy stílusos tányérral. Figyelj rá, hogy lehetőleg ne legyen a kép hátterében sok színes dolog, mert ez elveszi a figyelmet a modelledről.
            </li>
            <li>
                <strong>Komponáld meg a képet.</strong> Sok vagy kevés látszódjon a környezetből? Teljesen kitöltse az étel a képet, vagy megvágod? Keretet adsz neki a kiegészítőkkel? Kísérletezz, forgasd a tányért, keresd meg, hogy honnan néz ki a legjobban a kiszemelt étel. Próbálkozz magasabbról, alacsonyabbról, és játssz a távolsággal. Ha van a gépeden makró (közeli kép) funkció, az külön érdekes lehet.
            </li>
            <li>
                <strong>Támaszd meg a kezed.</strong> Főleg ha nincs elég fény vagy nem elég stabil a kezed, jobb, ha megtámasztod valamin vagy állványt használsz.
            </li>
            <li>
                <strong>Kapcsold ki a vakut.</strong> A vaku pontosan szemből világítja meg az ételt, így elveszíted az árnyékokat, és kevésbé lesznek változatosak a színek. Kerüld a direkt napfényt is. Ehelyett ha lehet, használj természetes, szórt fényt. Az ideális beállítás: ablak mellett, felhős napon, késő délelőtt-kora délután.
            </li>
            <li>
                <strong>Próbálj ki egy derítő lapot.</strong> A derítőlap egy nagy, világos felület, ami visszaveri a fényt az étel árnyékosabb oldalára. Használhatsz erre egy nagyobb, fehér papírlapot, vagy egy alufóliával bevont tepsit. Próbáld ki, milyen derítéssel és derítés nélkül ugyanaz a beállítás, hogy lásd a különbséget.
            </li>
            <li>
                <strong>Ne várj vele sokat.</strong> Főleg, ha meleg ételt fotózol. Ahogy hűl az étel, először a gőz tűnik el, aztán mattabb lesz az ételek felszíne, majd az élénkebb színek vesznek el. Ha nagyon sokat vársz, meg is penészedik, és akkor még éhen is maradsz. 😉
            </li>
        </ol>
        <p>9 ötlet, hogy teret engedjünk a kreativitásnak:</p>
        <ul>
            <li>Egyszerű kaja (zsíros kenyér, krumpli) szépen fotózva</li>
            <li>Tányér helyett beton. Vagy vászon, fa, rozsdás tepsi, sötét, zsírpapír, bambusz alátét, kockakő stb.</li>
            <li>Színezd át a kaját</li>
            <li>Kaja fura helyen</li>
            <li>Kajának kinéző dolog, ami nem is kaja</li>
            <li>Kaja a levegőben</li>
            <li>Kaja és kéz (öntesz, szórsz, belenyúlsz)</li>
            <li>Romlott kaja szexin fotózva</li>
            <li>A készítés és elfogyasztás folyamata gifben</li>
        </ul>

        <p>5 link az érdeklődőknek mások még jobb gasztrofotó-tippjeire:</p>
        <ul>
            <li>
                <ExternalLink href="http://www.mindmegette.hu/az-etelfotozas-fortelyai-47232/">7 tipp a mindmegette.hu-tól</ExternalLink> – ha valaki, ők értenek a kajákhoz.
            </li>
            <li>
                <ExternalLink href="http://blog.fotosarok.hu/2018/11/etelfotos-trukkok-foodstyling-alapok/">10 tipp Jay P. Morgan fotóstól</ExternalLink> – mobillal fotózóknak különösen ajánlott.
            </li>
            <li>2-in-1: Tippek <ExternalLink href="https://blogokrolneked.cafeblog.hu/2015/07/10/gasztro-fotozas-alapjai-12-pontban/">kezdőknek</ExternalLink> és <ExternalLink href="https://blogokrolneked.cafeblog.hu/2015/07/24/igy-alapozd-meg-gasztrofotoid-sikeret/">haladóknak</ExternalLink> – 12+10 tipp, szép képekkel.
            </li>
            <li>3-in-1: Három gyönyörű videó: <ExternalLink href="https://vimeo.com/133158982">Környezet és fények</ExternalLink> [2p], <ExternalLink href="https://vimeo.com/132959943">Stílus és kiegészítők</ExternalLink> [1p], <ExternalLink href="https://vimeo.com/132959942">Komponálás és keretezés</ExternalLink> [1p]
            </li>
            <li>
                <ExternalLink href="https://nlc.hu/eletmod/20161114/profi-etelfoto-trukkok/">5 tipp csaláshoz</ExternalLink> – a “kajának kinéző dolog, ami nem is kaja” ötletre elég jól rezonál.
            </li>
        </ul>

        <p>További profi galériák, nyálcsorgatásra és inspirációul: <ExternalLink href="https://hu.pinterest.com/search/pins/?rs=ac&len=2&q=food%20photography&eq=food%20ph&etslf=5905&term_meta[]=food%7Cautocomplete%7Cundefined&term_meta[]=photography%7Cautocomplete%7Cundefined">Pinterest kajafotók</ExternalLink>
            | <ExternalLink href="http://libbyvision.com/">Libby Vision Studio</ExternalLink>
            | <ExternalLink href="https://www.francescotonelli.com/">Francesco Tonelli</ExternalLink>
            | <ExternalLink href="http://foodphotography.co.uk/">David Munns</ExternalLink>
            | <ExternalLink href="https://www.mittongtarestudio.com/">Mittongtare Studio</ExternalLink>
            | <ExternalLink href="http://clarebarboza.com/">Clare Barboza</ExternalLink>
            | <ExternalLink href="http://www.keikooikawa.com/food#0">Keiko Oikawa</ExternalLink>
            | <ExternalLink href="http://www.timhillfoodphotographer.com/">Tim Hill</ExternalLink>
        </p>
    </>;
}