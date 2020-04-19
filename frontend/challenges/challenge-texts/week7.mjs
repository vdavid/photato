/**
 * @param {ChallengeGetMaterialArguments}
 * @returns {string}
 */
export function getMaterial({formattedDeadline, createPhotoUploadLink, createFullWidthLocalImage}) {
    return `<p><strong>Röviden:</strong></p>

<p>Egy <strong>hosszú záridős fotót</strong> várunk tőled, amit ${createPhotoUploadLink('itt tudsz feltölteni')}. Kedden közös fotózós esemény lesz, <a href="https://www.facebook.com/events/2265483047079220/">jelentkezz itt!</a> </p>

<p><strong>Hosszabban:</strong></p>

<p>${createFullWidthLocalImage('zsofi.gif', 'Zsófi az utcán')}</p>

<p>Ezen a héten a két héttel ezelőtti mozgás technikának az ellenkezőjét fogjuk megtanulni és gyakorolni. A múltkor az volt a cél, hogy nagyon élesen fotózzunk le gyorsan mozgó dolgokat. Most nem feltétlenül gyorsan mozgó dolgokat fogunk lefotózni úgy, hogy bemozduljon a kép c vagy annak bizonyos részei. A legjobb képedet ${formattedDeadline}-ig, ${createPhotoUploadLink('itt tudod feltölteni')}.</p>

<p>Ezt úgy fogjuk elérni, hogy <strong>hosszan</strong> nyitva tartjuk a zárat. Emlékeztetőül, itt az összefoglaló kép az 5. hétről:</p>

<p>${createFullWidthLocalImage('settings.jpg', 'Beállítások')}</p>

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
    <li><strong>Használj fényképezőgépet.</strong> Vagy jó mobilt. A legtöbb mobil maximum 1 másodpercig tud exponálni. Alternatíva lehet még egy pro mobil kamera app (<a href="https://play.google.com/store/apps/details?id=com.flavionet.android.camera.lite">Camera FV-5</a>, <a href="https://apps.apple.com/us/app/procam-4-manual-camera-raw/id730712409">ProCam 5</a>)</li>
    <li><strong>Használj állványt.</strong> Vagy tedd le a gépet egy stabil helyre. Ha nincs állványod, használd a 2. héten tanult pulcsis trükköt, vagy egy kis babzsákot.</li>
    <li><strong>Állítsd manuális módba.</strong> Ha van a gépeden manuális (“M”) üzemmód, állítsd be azt.<br /><em>Megjegyzés:</em> Ha túl bonyolult a manuális mód, választhatod a záridőelőválasztás módot is (“S” vagy “Tv”, gépe válogatja). Így kicsit kisebb a szabadságod, de a blendét automatikusan beállítja neked a gép.</li>
    <li><strong>Válassz alacsony ISO értéket.</strong> Állítsd a legalacsonyabbra (pl. 100).<br /><em>Megyjegyzés:</em> Ha nagyon sötét van, akkor a legalacsonyabb ISO értékkel nagyon sokat kell várnod, mire elkészül egy kép. Megoldásul beállíthatsz valamivel magasabb ISO értéket (pl. 200, esetleg 400), de ügyelj rá, hogy ha túl magasra állítod, szemcsés lesz a kép. Kísérletezz!</li>
    <li><strong>Szűkítsd a blendét.</strong> Ha világos van, állítsd a blendét szűkre (pl. f/8, f/16), de ne túl szűkre. Nagyon szűk blendénél a fényelhajlás jelensége miatt <a href="https://www.tripont.hu/problog/2625/capture_one_pro_10__a_fenyelhajlas_tobbe_nem_okoz_gondot">életlen lehet a kép</a>. Ha nagyon sötét van, akkor is lehet, hogy tágabb blendével jársz jól. Kísérletezz ezzel is bátran.</li>
    <li><strong>Állítsd be a hosszú záridőt.</strong> Ízlés szerint 1–30 másodpercre, vagy “B” (“Bulb”) módra. Bulb módban egészen addig nyitva marad a zár, ameddig lenyomva tartod az exponáló gombot.</li>
    <li><strong>Ellenőrizd a beállításokat.</strong> Figyelj a gép ajánlására, hogy a beállított záridővel, blendével és ISO értékkel helyesen exponáld a képet: hogy ne legyen se túl sötét, se túl világos. Ha nem tökéletes, játssz elsősorban a záridővel.</li>
    <li><strong>Fókuszálj manuálisan.</strong> Kevés fénynél gyakran nem működik jól az autofókusz. Ilyenkor jobb, ha kézzel állítod be.</li>
    <li><strong>Engedd el a gépet.</strong> A gép óhatatlanul megmozdul egy picit, amikor megnyomod az exponáló gombot. Használj önkioldót ⏲️: minden gépen be lehet állítani 2 másodperces várakozást, pont emiatt. Ha esetleg van távkioldó a gépedhez, az még jobb, mert akkor még várnod sem kell.</li>
    <li><strong>Ha kell, használj ND szűrőt.</strong> Ha sok a fény és elkötelezett fotós vagy, csökkentsd a gépbe jutó fény mennyiségét egy megfelelő <a href="https://pixinfo.com/cikkek/objektiv-szurokrol-egyszeruen/">természetes szürke szűrővel</a>.</li>
    <li><strong>+1: Gyere velünk fotózni a Margitszigetre!</strong> Az előző tanfolyamokon a hosszú záridős képek bizonyultak a legtöbb embernek az egyik legnehezebbnek, ezért ezen a héten szeretnénk segíteni nektek a közösség erejével. <a href="https://www.facebook.com/events/2265483047079220/">Jelentkezz itt</a> a keddi eseményre!</li>
</ol>

<p>6 link további infókkal és ötletekkel – érdemes őket megnézni:</p>

<ul>
    <li><a href="https://vaku.hu/2017/07/25/a-hosszu-expozicios-ideju-fotozas-alapjai/">A hosszú záridős fotózás alapjai</a></li>
    <li><a href="http://fotopiac.hu/bemozdulni-vagy-bemozditani/">Bemozdulni vagy bemozdítani?</a></li>
    <li><a href="http://indafoto.blog.hu/2011/05/19/fenycsikok_hosszu_zaridovel">Fénycsíkok hosszú záridővel</a></li>
    <li><a href="https://www.canon.hu/get-inspired/tips-and-techniques/how-to-control-exposure/">Az expozíció beállításairól a Canontól</a></li>
    <li><a href="http://www.tripont.hu/problog/2625/capture_one_pro_10__a_fenyelhajlas_tobbe_nem_okoz_gondot">A nagyon szűk blende problémája: a fényelhajlás</a></li>
    <li><a href="https://pixinfo.com/cikkek/objektiv-szurokrol-egyszeruen/">ND szűrő, egyéb szűrők</a></li>
</ul>

<p>Kreatív feladatok, variációk, érdekességek:</p>
<ul>
    <li>Fess fénnyel (<a href="https://hu.pinterest.com/search/pins/?rs=ac&len=2&q=light%20painting%20photography">inspiráció</a>)</li>
    <li>Vakuzz közbe</li>
    <li>Készíts gif-et több képből</li>
</ul>

<p>Inspiráció: <a href="https://hu.pinterest.com/search/pins/?q=long%20exposure">Pinterest hosszú exponálási idő</a> | <a href="https://hu.pinterest.com/search/pins/?q=light%20painting%20photography">Pinterest fényfestés</a> | <a href="https://pixinfo.com/cikkek/igy-fotozz-este-es-ejszaka/">Pixinfo: fotózás sötétben</a></p>

<p>Ha még nem küldted be a múlt heti (állatos/növényes) képedet, ma éjfélig még azt is ${createPhotoUploadLink('megteheted')}. 🕚</p>

<p>A hosszú záridős képeket pedig ${createPhotoUploadLink('itt')} várjuk!</p>

<p>TODO

<p>Jó fotózást,</p>

<p>--<br />
    a Photato csapata</p>`;
}