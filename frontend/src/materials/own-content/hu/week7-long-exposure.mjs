import React from '../../../web_modules/react.js';
import FullWidthLocalImage from '../../../challenges/components/FullWidthLocalImage.mjs';
import ExternalLink from '../../components/ExternalLink.mjs';

// noinspection JSUnusedGlobalSymbols (This file is loaded dynamically.)
/**
 * @returns {ArticleMetadata}
 */
export function getMetadata() {
    // noinspection SpellCheckingInspection (It's in Hungarian.)
    return {
        slug: 'week7-long-exposure',
        title: 'Tippek hosszú záridős fotózáshoz',
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
        <FullWidthLocalImage fileName="zsofi.gif" altText="Zsófi az utcán" />

        <p>Hosszú exponálási idejű fényképek készítésénél gyakran az a cél, hogy bemozduljon a kép, vagy annak bizonyos részei, míg más részek élesek maradnak. Ezt úgy fogjuk elérni, hogy <strong>hosszan</strong> nyitva tartjuk a zárat. Emlékeztetőül, itt az összefoglaló kép a beállításokról:</p>

        <FullWidthLocalImage fileName="settings.jpg" altText="Beállítások" />

        <p>(Ismétlésképp: a felső 2 sorban a <strong>blende</strong> és a vele járó mélységélesség, alatta a <strong>záridő</strong>, alatta az <strong>ISO érték</strong>)</p>

        <p>Ha a zárat hosszan nyitva tartod, hosszú ideig érkezik be fény a tárgyról a gép érzékelőjére. Eközben kétféleképp tud bemozdulni/elmosódni a kép:</p>

        <ol>
            <li>A gép elmozdul. Ilyen például, amikor remeg a kezed, vagy véletlenül megmozdítod a gépet.</li>
            <li>A kép tárgya mozdul el. Pl. amikor le szeretnél fotózni valakit, de ő közben mozog.</li>
        </ol>

        <p>Hosszú exponálási idővel való fotózásnál leggyakrabban az a cél, hogy a kép egy bizonyos része éles legyen, a többi része pedig mosódjon el. Ezt meg lehet csinálni a gép elmozdításával is (ld. úsztatásos technika az 5. héten), de ez viszonylag nehéz, ezért most arra az esetre fogunk koncentrálni, amikor <strong>a gép stabil</strong>, míg a fotótéma egy része mozog.</p>

        <p>Hosszú exponálási idővel tipikusan kétféle környezetben szoktunk fotózni:</p>

        <ol>
            <li><strong>Sötét környezetben</strong> – pl. sötét helyiségben vagy éjszaka. Ez az egyszerűbb eset, itt viszonylag sok tered van a beállításra.</li>
            <li><strong>Világos környezetben</strong> – pl. utcán. Ez kicsit bonyolultabb: úgy kell beállítanod a géped, hogy kevés fény jusson be: szűk blende és alacsony ISO érték. Ha nagyon sok a fény, akkor még a legszűkebb blendével és a legalacsonyabb ISO-val sem tudod elérni a célod. Ilyenkor úgynevezett ND szűrőt kell alkalmaznod, amit általában külön meg kell vásárolnod a gépedhez/objektívedhez.</li>
        </ol>

        <p>10 tipp a remek fotókhoz:</p>

        <ol>
            <li><strong>Használj fényképezőgépet.</strong> Vagy jó mobilt. A legtöbb mobil maximum 1 másodpercig tud exponálni. Alternatíva lehet még egy pro mobil kamera app (<ExternalLink href="https://play.google.com/store/apps/details?id=com.flavionet.android.camera.lite">Camera FV-5</ExternalLink>, <ExternalLink href="https://apps.apple.com/us/app/procam-4-manual-camera-raw/id730712409">ProCam 5</ExternalLink>)</li>
            <li><strong>Használj állványt.</strong> Vagy tedd le a gépet egy stabil helyre. Ha nincs állványod, használd a 2. héten tanult pulcsis trükköt, vagy egy kis babzsákot.</li>
            <li><strong>Állítsd manuális módba.</strong> Ha van a gépeden manuális (“M”) üzemmód, állítsd be azt.<br /><em>Megjegyzés:</em> Ha túl bonyolult a manuális mód, választhatod a záridőelőválasztás módot is (“S” vagy “Tv”, gépe válogatja). Így kicsit kisebb a szabadságod, de a blendét automatikusan beállítja neked a gép.</li>
            <li><strong>Válassz alacsony ISO értéket.</strong> Állítsd a legalacsonyabbra (pl. 100).<br /><em>Megyjegyzés:</em> Ha nagyon sötét van, akkor a legalacsonyabb ISO értékkel nagyon sokat kell várnod, mire elkészül egy kép. Megoldásul beállíthatsz valamivel magasabb ISO értéket (pl. 200, esetleg 400), de ügyelj rá, hogy ha túl magasra állítod, szemcsés lesz a kép. Kísérletezz!</li>
            <li><strong>Szűkítsd a blendét.</strong> Ha világos van, állítsd a blendét szűkre (pl. f/8, f/16), de ne túl szűkre. Nagyon szűk blendénél a fényelhajlás jelensége miatt <ExternalLink href="https://www.tripont.hu/problog/2625/capture_one_pro_10__a_fenyelhajlas_tobbe_nem_okoz_gondot">életlen lehet a kép</ExternalLink>. Ha nagyon sötét van, akkor is lehet, hogy tágabb blendével jársz jól. Kísérletezz ezzel is bátran.</li>
            <li><strong>Állítsd be a hosszú záridőt.</strong> Ízlés szerint 1–30 másodpercre, vagy “B” (“Bulb”) módra. Bulb módban egészen addig nyitva marad a zár, ameddig lenyomva tartod az exponáló gombot.</li>
            <li><strong>Ellenőrizd a beállításokat.</strong> Figyelj a gép ajánlására, hogy a beállított záridővel, blendével és ISO értékkel helyesen exponáld a képet: hogy ne legyen se túl sötét, se túl világos. Ha nem tökéletes, játssz elsősorban a záridővel.</li>
            <li><strong>Fókuszálj manuálisan.</strong> Kevés fénynél gyakran nem működik jól az autofókusz. Ilyenkor jobb, ha kézzel állítod be.</li>
            <li><strong>Engedd el a gépet.</strong> A gép óhatatlanul megmozdul egy picit, amikor megnyomod az exponáló gombot. Használj önkioldót ⏲️: minden gépen be lehet állítani 2 másodperces várakozást, pont emiatt. Ha esetleg van távkioldó a gépedhez, az még jobb, mert akkor még várnod sem kell.</li>
            <li><strong>Ha kell, használj ND szűrőt.</strong> Ha sok a fény és elkötelezett fotós vagy, csökkentsd a gépbe jutó fény mennyiségét egy megfelelő <ExternalLink href="https://pixinfo.com/cikkek/objektiv-szurokrol-egyszeruen/">természetes szürke szűrővel</ExternalLink>.</li>
        </ol>

        <p>6 link további infókkal és ötletekkel – érdemes őket megnézni:</p>

        <ul>
            <li><ExternalLink href="https://vaku.hu/2017/07/25/a-hosszu-expozicios-ideju-fotozas-alapjai/">A hosszú záridős fotózás alapjai</ExternalLink></li>
            <li><ExternalLink href="http://fotopiac.hu/bemozdulni-vagy-bemozditani/">Bemozdulni vagy bemozdítani?</ExternalLink></li>
            <li><ExternalLink href="http://indafoto.blog.hu/2011/05/19/fenycsikok_hosszu_zaridovel">Fénycsíkok hosszú záridővel</ExternalLink></li>
            <li><ExternalLink href="https://www.canon.hu/get-inspired/tips-and-techniques/how-to-control-exposure/">Az expozíció beállításairól a Canontól</ExternalLink></li>
            <li><ExternalLink href="http://www.tripont.hu/problog/2625/capture_one_pro_10__a_fenyelhajlas_tobbe_nem_okoz_gondot">A nagyon szűk blende problémája: a fényelhajlás</ExternalLink></li>
            <li><ExternalLink href="https://pixinfo.com/cikkek/objektiv-szurokrol-egyszeruen/">ND szűrő, egyéb szűrők</ExternalLink></li>
        </ul>

        <p>Kreatív feladatok, variációk, érdekességek:</p>
        <ul>
            <li>Fess fénnyel (<ExternalLink href="https://hu.pinterest.com/search/pins/?rs=ac&len=2&q=light%20painting%20photography">inspiráció</ExternalLink>)</li>
            <li>Vakuzz közbe</li>
            <li>Készíts gif-et több képből</li>
        </ul>

        <p>Inspiráció: <ExternalLink href="https://hu.pinterest.com/search/pins/?q=long%20exposure">Pinterest hosszú exponálási idő</ExternalLink> | <ExternalLink href="https://hu.pinterest.com/search/pins/?q=light%20painting%20photography">Pinterest fényfestés</ExternalLink> | <ExternalLink href="https://pixinfo.com/cikkek/igy-fotozz-este-es-ejszaka/">Pixinfo: fotózás sötétben</ExternalLink></p>
    </>;
}