import React from '../../../web_modules/react.js';
import ExternalLink from '../../components/ExternalLink.mjs';

// noinspection JSUnusedGlobalSymbols (This file is loaded dynamically.)
/**
 * @returns {ArticleMetadata}
 */
export function getMetadata() {
    // noinspection SpellCheckingInspection (It's in Hungarian.)
    return {
        slug: 'week3-close-up-photography',
        title: 'Makrofotózás tippek',
        author: 'Photato',
        publishDate: new Date('2020-06-07'),
        publisherName: 'Photato',
        unlockWeekIndex: 3,
    };
}

// noinspection JSUnusedGlobalSymbols (This file is loaded dynamically.)
/**
 * @returns {React.ReactElement}
 */
export default function Article() {
    // noinspection SpellCheckingInspection (It's in Hungarian.)
    return <>
        <p>A makró fotózás a köznyelvben egyszerűen azt jelenti, hogy közelről fotózunk dolgokat. Ezzel a definícióval most meg is elégszünk. Szóval ezen a héten a részletekre megyünk rá, kültéren vagy beltéren fotózunk élő vagy élettelen témát; a lényeg, hogy közelről.</p>

        <p>5 tippet hoztunk neked ehhez:</p>

        <ol>
            <li><strong>Válts perspektívát.</strong> Vizsgáld meg az apró részleteket a hétköznapi környezetedben. Hajolj/feküdj le és keresd meg a témád. Gyakran ott találod meg, ahol legkevésbé számítasz rá. Az apró állatok, növények általában részletgazdagabb makró témát adnak, de élettelen dolgokból is tudsz találni izgalmasat.</li>
            <li><strong>Zoomolj, fókuszálj.</strong> Ha olyan a géped, zoomolj rá a témára, és kézzel állítsd be a fókuszt.</li>
            <li><strong>Stabilizálj.</strong> Legyen stabil a gép, mert a legkisebb mozgás is hatalmas ezen a szinten. Ha kell, állíts be egy 2 másodperces időzítőt, hogy a kezed se mozgassa a gépet. Ezt a funkciót gyakorlatilag minden fényképezőgép és kamera app tudja.</li>
            <li><strong>Figyelj a fényre.</strong> Ne takard ki a géppel a fényforrást. Használj természetes szórt fényt; ha kell, deríts egy fehér lappal. Kerüld a direkt napfényt.</li>
            <li><strong>Kísérletezz a háttérrel.</strong> Mivel közelre fókuszálsz, biztosan nem lesz éles a háttér, de például az apró pontszerű fények (levelek között átszűrődő fény vagy a város fénye) gyakran érdekes formákat adnak ki. Ezt hívjuk <ExternalLink href="https://hu.m.wikipedia.org/wiki/Bokeh">bokeh hatás</ExternalLink>nak.</li>
        </ol>

        <p>Kreatív feladatok, variációk, érdekességek:</p>

        <ul>
            <li>Tegyél apró figurákat kis dolgok mellé, hogy nagynak hassanak. <ExternalLink href="https://www.pinterest.com/eileend1948/miniature-figure-photography/">Példa képek</ExternalLink></li>
            <li>Válts ki makró-hatást normál képekből, miniatűr effekttel. <ExternalLink href="https://www.awwwards.com/tilt-shift-photography-for-spectacular-miniature-effect.html">Példa képek</ExternalLink> | Hogyan: <ExternalLink href="http://webdesignsuli.hu/webdesigner_blog/tilt-shift-azaz-makett-effekt-keszitese-photoshopban/">Photoshoppal (magyarul)</ExternalLink>
                | <ExternalLink href="http://www.instructables.com/id/How-to-Achieve-Miniature-Effect-via-Photoshop/">Photoshoppal (angolul)</ExternalLink>
                | <ExternalLink href="https://www.thoughtco.com/how-to-make-tilt-shift-effect-1701697">GIMP-pel (angolul)</ExternalLink>.
                A <ExternalLink href="https://www.adobe.com/hu/products/photoshop.html">Photoshop</ExternalLink> (€25/hó) és a <ExternalLink href="https://www.gimp.org/downloads/">GIMP</ExternalLink> (ingyenes) fotószerkesztő programok.</li>
            <li>Ha csak egy mobilod és 50ft-od van, itt egy tipp, hogy <ExternalLink href="https://www.youtube.com/watch?v=W3KhZErpBuo">hogyan gyárts magadnak makró lencsét</ExternalLink>.</li>
            <li>Egy komolyabb kihívás: <ExternalLink href="https://tisztaegtisztafold.hu/makrofotozas-forditott-objektiv/">fotózz makrót fordított objektívvel</ExternalLink></li>
        </ul>

        <p>Linkek:</p>

        <ul>
            <li>Akiket mélyebben érdekel a téma, itt egy rendkívül igényes és részletes <ExternalLink href="http://www.bykyny.hu/fenykepezes-kozelfenykepezes.shtml">cikk makrofotózásról</ExternalLink>, Bereczky Péter tollából.</li>
            <li>Tippek az sg.hu-tól <ExternalLink href="https://sg.hu/cikkek/it-tech/44392/hogyan-fotozzunk-makrofotozas-i">egyszerűbb</ExternalLink> (kompakt) és <ExternalLink href="https://sg.hu/cikkek/44443/hogyan_fotozzunk_makrofotozas_ii">komolyabb</ExternalLink> (tükörreflexes és MILC) gépekhez.</li>
            <li>Tippek a <ExternalLink href="https://www.canon.hu/get-inspired/tips-and-techniques/macro-photography/">Canontól</ExternalLink>, röviden</li>
        </ul>

        <p>Inspiráció: <ExternalLink href="https://www.pinterest.com/explore/close-up-photography/">Pinterest</ExternalLink>
            | <ExternalLink href="https://mobilephotoawards.com/macro-details-winner-honorable-mentions-6th-annual-mpa/">Mobile Photo Awards</ExternalLink>
            | <ExternalLink href="https://500px.com/krisztinmrkus">Márkus Krisztián bogarai</ExternalLink>
            | <ExternalLink href="https://www.smashingmagazine.com/2009/06/35-examples-of-stunning-macro-photography/">Smashing Magazine</ExternalLink>
        </p>
    </>;
}