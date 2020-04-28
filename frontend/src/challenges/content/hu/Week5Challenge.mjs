import React from '../../../web_modules/react.js';
import FullWidthLocalImage from '../../components/FullWidthLocalImage.mjs';
import PhotoUploadLink from '../../components/PhotoUploadLink.mjs';
import ExternalLink from '../../../materials/components/ExternalLink.mjs';

// noinspection JSUnusedGlobalSymbols (It's imported dynamically.)
/**
 * @param {string} formattedDeadline
 * @returns {React.ReactElement}
 */
export default function Week5Challenge({formattedDeadline}) {
    return <>
<p><strong>Röviden:</strong></p>

<ul>
    <li>Egy <strong>gyorsan mozgó dologról készült fotót</strong> várunk tőled, és <PhotoUploadLink label="itt tudod feltölteni" />.</li>
    <li>Ezen a héten elmagyarázunk némi elméletet, ami eddig hiányozhatott a tarsolyodból.</li>
    <li>Július 4-én (szerdán) 18:00-kor <strong>közös fotózás</strong> lesz a Margitszigeten. <ExternalLink href="https://www.facebook.com/events/688185368187546/">Jelentkezz itt!</ExternalLink></li>
</ul>

<p><strong>Hosszabban:</strong></p>

<FullWidthLocalImage fileName="biker.jpg" altText="Motoros" />

<p>Valószínűleg sokszor tapasztaltad már, hogy amikor gyorsan le akarsz kapni valamit (pl. sportrendezvény, koncert, gyerekek/állatok fotózása, autóból kifényképezés), a képek gyakran elmosódottak lesznek. Ez azért van, mert az alatt az idő alatt, amíg a fénykép készül – tehát amíg a kamera rekesze nyitva van – elmozdul a fotótéma. Ezen a héten azt fogjuk gyakorolni, hogy hogyan lehet ezt minél inkább elkerülni, és szép, éles képeket készíteni ezekben a helyzetekben.</p>

<p><strong>Fontos infó a mobillal fotózóknak:</strong> Igazi jó megoldást fényképezőgéphez fogunk adni. Ha elsősorban mobillal fotózol, esetleg érdemes lehet most keresni/kölcsönkérni egy fényképezőgépet, mert ezen a héten sok fotós trükköt tanulhatsz. Ha inkább maradnál a mobilnál, akkor vagy olvass tovább annak tudatában, hogy nem mindent fogsz tudni most azonnal hasznosítani, vagy ugorj a levél aljára, ahol általánosabb tippeket adunk az e heti feladathoz.</p>

<p><strong>Egy kis elmélet, fényképezőgéphez:</strong></p>

<p>Szóval elmosódott képek. A megoldás a fényképezőgép beállításai között lesz. Ezen a héten megismerjük a három legfontosabb beállítást: a blendét, záridőt és ISO értéket ezen a héten fogjuk megtanulni.</p>

<ul>
    <li><strong>blende</strong> (aperture): mennyire legyen tág/szűk a fényképezőgép nyílása, amin az érzékelőre jut a fény.</li>
    <li><strong>záridő</strong> (shutter speed): mennyi ideig legyen nyitva a fényképezőgép nyílása.</li>
    <li><strong>ISO érték</strong>: mennyire legyen érzékeny a kamera fényérzékelője.</li>
</ul>

<p>Itt egy ábra is ezekről. A felső 2 sorban a <strong>blende</strong> és a vele járó mélységélesség, alatta a <strong>záridő</strong>, alul pedig az <strong>ISO érték</strong>:</p>

<FullWidthLocalImage fileName="settings.jpg" altText="Beállítások" />

<p>Ha a képre nézve az volt az első gondolatod, hogy “fú, ez bonyolultnak néz ki”, akkor jó hírünk van: ha rászánsz most egy kis időt, pár perc múlva már nem lesz ijesztő ez a kép. 😊 Ezt a 3-4 dolgot csináld meg:</p>

<ol>
    <li>Tölts el egy percet a fenti képpel. Nézd meg, mit írtunk róla fentebb (blende, záridő, ISO érték). Keresd meg a kép 3 részét, és gondolkozz egy picit, mit ábrázolhatnak.</li>
    <li>Olvasd el a <ExternalLink href="https://fotozasblog.hu/digitalis-fotozas/">Fotózás alapjai</ExternalLink> cikk “Rekesz, blende, rekeszérték” és “Záridő” részeit. Ha van rá időd, fusd át a "Mélységélesség" részt is. Ez után nézd meg a fenti képet újra. Az első két sor a mélységélességet és a blendét illusztrálja, a harmadik sor pedig a záridőt.</li>
    <li>Olvasd el a cikk <ExternalLink href="https://fotozasblog.hu/fotozas-alapjai-iso-fenymeres/">második részének</ExternalLink> “ISO érzékenység” részét. Aztán nézd meg újra a fenti kép utolsó sorát, ami az ISO érzékenységet illusztrálja.</li>
    <li>(Opcionális) Ha beszélsz valamennyire angolul és szívesen tanulsz videóból, jó szívvel ajánljuk <ExternalLink href="https://www.youtube.com/watch?v=F8T94sdiNjc">Tony Northrup 15 perces videóját</ExternalLink>, amiben még egyszer elmagyarázza ezeket. A cikkekből és a videóból nagyon stabilan meg fogod érteni, hogy mik ezek a beállítások. Nézd meg még egyszer a fenti képet. Így már nem ijesztő, ugye? 😊</li>
</ol>

<p><strong>Gyakorlás fényképezőgéppel:</strong></p>

<ul>
    <li><strong>Manuális mód:</strong> Állítsd a fényképezőgéped manuális (“M”) üzemmódba. Ez nem minden gépen egyértelmű, pedig általában csak egy gombnyomásra van a beállítás. Próbálkozz bátran, mindjárt meglesz!</li>
    <li><strong>Blende:</strong> Próbálgasd egyesével beállítani az értékeket. Figyeld meg, hogy ahogy növeled a blende értéket (szűkíted a blendét), egyre sötétedik a kép, de nő a mélységélesség: a közeli és távoli dolgok egyaránt élesek lesznek.</li>
    <li><strong>Záridő:</strong> Figyeld meg, hogy ahogy növeled a záridőt, egyre világosodik a kép, de egyre könnyebben bemozdul a fotó, pl. a kezed remegésétől.</li>
    <li><strong>ISO érték:</strong> Figyeld meg, hogy ahogy növeled az ISO értéket, egyre világosodik, de zajosodik a kép.</li>
</ul>

<FullWidthLocalImage fileName="horse.jpg" altText="Ló." />

<p><strong>Gyorsan mozgó dolgok fotózása fényképezőgéppel:</strong></p>

<p>Ha elolvastad a cikket és kipróbálgattad a beállításokat, állítsd a géped <strong>“záridő-előválasztás” üzemmódba</strong>. Ezt a fényképezőgép típusától függően az “S” (shutter speed) vagy “Tv” (time value) betűk jelölik. Ez a manuális (“M”) módhoz képest azzal könnyíti meg az életed, hogy csak a záridőt és az ISO értéket kell beállítanod, a blendét beállítja magától. Általában ebben a módban érdemes gyorsan mozgó dolgokat fotózni, mert elég pontos beállítást tesz lehetővé viszonylag gyorsan.</p>

<p>Most pedig gondoljuk végül együtt, hogyan érdemes beállítani ezeket az értékeket gyorsan mozgó dolgok fényképezéséhez.</p>

<ol>
    <li><strong>Ne mozduljon be a kép.</strong> Ez a legfontosabb dolog, ennek kulcsa pedig a <strong>rövid záridő,</strong> tehát hogy rövid idő alatt készüljön el a kép. Ökölszabályként, sportfotózáshoz  az <strong>1/1250 másodperc</strong>es záridő az ideális – de az abszolút maximum az 1/300 másodperc.<br />Továbbra is záridő-előválasztás (“S” vagy “Tv”) módban tartva a géped, állítsd be a záridőt <strong>1/500 másodpercre</strong>.</li>
    <li><strong>Engedj be sok fényt.</strong> Ezzel most nincs dolgod, “S”/“Tv” üzemmódban a blende-beállítást elvégzi helyetted a gép a fényviszonyok függvényében.</li>
    <li><strong>Állítsd nagyra az érzékenységet.</strong> Ha túl sötét a kép, növeld az ISO értéket addig, amíg szépen kivilágosodik. A fényviszonyoktól függően lehet, hogy ez az érték nagyon magas lesz (6400 vagy még több), különösen, ha éppen beltérben próbálgatod. De napos időben megúszhatod 400-as vagy még kisebb ISO-val is.</li>
    <li><strong>Finomhangolj.</strong> Ha jók a fényviszonyok és a fentiek alapján beállított ISO érték alacsony, akkor növelheted a záridőt, hogy még rövidebb pillanatot kaphass el. Ez után az ISO értéket növeld ismét addig, hogy a gép szerint “pont megfelelően fényes” legyen a kép. 1/1250 másodpercnél rövidebb záridőt ritkán érdemes használni. Ha ezt eléred, akkor inkább az ISO-t csökkentsd, hogy minél tisztább, zajmentesebb legyen a kép. Ha még így is túl világos lenne, a gép majd megnöveli a blende értéket, hogy pont jó legyen.</li>
</ol>

<p><strong>Megjegyzés:</strong> Az is lehet, hogy olyan a géped/optikád, hogy közepes fényviszonyok között még a legnagyobb ISO-val sem lesz elég világos a kép 1/1250 másodperces záridővel. Ez esetben két dolgot tehetsz:</p>
<ol>
    <li>Inkább olyan fotótémát választasz, ahol több a fény (pl. beltéri sportesemény helyett kültérit, vagy kivársz egy naposabb időt).</li>
    <li>Megelégszel egy rövidebb záridővel, és megpróbálod a kevésbé gyors pillanatokat elkapni.</li>
</ol>

<FullWidthLocalImage fileName="glass.jpg" altText="Pohár." />

<p><strong>Néhány tipp és variáció mindenkinek:</strong></p>
<ol>
    <li><strong>Komponálj előre.</strong> Ha kiszámítható pályán halad a fotótémád, akkor állj be egy jó helyre, találd meg a kompozíciót, végezd el a beállításokat ha kell, aztán csak várd a megfelelő pillanatot.</li>
    <li><strong>Készíts sorozatfelvételt.</strong> Ne sajnáld a memóriakártyád, majd később kiválogatod a képeket. Gyorsan zajló eseményeknél a profik is így csinálják. Sokszor a legbiztosabb módja annak, hogy legyen 1 jó képed az, ha csinálsz 50-et.</li>
    <li><strong>Úsztatás (“svenkelés”/”behúzás”).</strong> Azt jelenti, hogy a kamerát folyamatosan mozgatva követed a fotótémád mozgását. Ezzel elérheted, hogy a tárgyad éles lesz, míg a háttér elmosódik. Ez <ExternalLink href="https://hu.pinterest.com/search/pins/?q=panning%20photography">nagyon menőn tud kinézni</ExternalLink>.<br />
        Állítsd be előre a géped: egy hosszabb, nagyságrendileg 1/80 körüli záridő lesz a nyerő – a pontos érték a témától, az ügyességedtől és az ízlésedtől függ.<br />
        Amikor feltűnik a fotótémád, nyomd le az exponáló gombot és közben fordulj a tárgyad után úgy, mintha videót készítenél róla.<br />
        Ez a módszer csak akkor működik, ha tudod előre, hogy milyen pályán fog mozogni a témád. Emellett érdemes tudni, hogy ez a nehezebb technikák egyike: keveseknek sikerül elsőre jó képekeket készíteni vele. De ha tetszik, érdemes gyakorolnod, és előbb-utóbb ráérezel.</li>
    <li><strong>Chronophotography.</strong> Itt a mozgás több fázisát kombinálod utómunka során egy képpé, <ExternalLink href="https://hu.pinterest.com/search/pins/?q=chronophotograpy%20sport">valahogy így</ExternalLink>. Ehhez állványról kell fotóznod és a sima sportfotózáshoz hasonlóan rövid záridővel sorozatfelvételt készítened az akcióról. A több elkészült képet utána egy képszerkesztő programmal (pl. <ExternalLink href="https://www.gimp.org/downloads/">GIMP</ExternalLink>, Photoshop) összekombinálhatod egy képpé. Ennek a pontos mikéntjére itt sajnos terjedelmi okokból nem tudunk kitérni, de ha tudsz angolul, az internetek segítenek neked. 😀</li>
    <li><strong>Válassz témát szabadon.</strong> Lehet, hogy a héten nem mész sporteseményre, vagy rossz idő lesz, vagy csak nem ihlet meg téged a sport. Nyugodtan engedd el. Valószínűleg rengeteg más mozgó dolog van a környékeden. Néhány ötlet, amit fotózhatsz: autók, mozóglépcső, hintázó gyerekek, repülő labdák. További ötletekért nézd meg az "Inspiráció" részt lejjebb.</li>
    <li><strong>Gyere velünk fotózni a Margitszigetre!</strong> Az előző tanfolyamon a sportfotók bizonyultak a legtöbb embernek a legnehezebbnek, ezért ezen a héten szeretnénk segíteni nektek a közösség erejével. <ExternalLink href="https://www.facebook.com/events/688185368187546/">Jelentkezz itt</ExternalLink> a szerdai eseményre!</li>
</ol>

<p><strong>Linkek:</strong></p>
<ul>
    <li>Fotózás alapok: <ExternalLink href="https://fotozasblog.hu/digitalis-fotozas/">rekesz, záridő, zoom</ExternalLink> | <ExternalLink href="https://fotozasblog.hu/fotozas-alapjai-iso-fenymeres/">fénymérés, ISO, vaku</ExternalLink>.</li>
    <li><ExternalLink href="http://fotozz.hu/cikket_megmutat?cikk_ID=83">Tippek gyorsan mozgó témákhoz</ExternalLink> a fotozz.hu-tól</li>
    <li><ExternalLink href="https://www.canon.hu/get-inspired/tips-and-techniques/capturing-motion/">Tippek gyorsan mozgó témákhoz</ExternalLink> a Canon oldaláról</li>
    <li><ExternalLink href="http://www.photonet.hu/arhiv/sportfotozas.html">Sportfotózásról</ExternalLink> a Photonet.hu-tól</li>
    <li>Inspiráció: <ExternalLink href="https://hu.pinterest.com/search/pins/?q=sport%20photography">Pinterest sportfotók</ExternalLink> | <ExternalLink href="https://hu.pinterest.com/search/pins/?q=panning%20photography">Pinterest úsztatásos fotók</ExternalLink> | <ExternalLink href="https://hu.pinterest.com/search/pins/?q=chronophotograpy%20sport">Pinterest chronophotography</ExternalLink> | <ExternalLink href="https://mashable.com/2016/09/29/red-bull-photography-contest/?europe=true">Red Bull sportfotók</ExternalLink></li>
    <li><ExternalLink href="https://www.facebook.com/events/688185368187546/">Margitszigeti fotózás</ExternalLink></li>
</ul>

<p>A legjobb gyorsan mozgó képedet ${formattedDeadline}-ig, <PhotoUploadLink label="itt tudod feltölteni" />.</p>

<p>Ha még nem küldted be a múlt heti (utcai fotós) képedet, ma éjfélig még azt is <PhotoUploadLink label="megteheted" />. 🕚</p>

<p>Jó fotózást,</p>

<p>--<br />
    a Photato csapata</p>
</>;
}