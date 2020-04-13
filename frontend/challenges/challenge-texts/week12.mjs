export async function getMaterial({formattedDeadline, createPhotoUploadLink, createFullWidthImage}) {
    return `<p><strong>Röviden:</strong>
</p>
<ul>
    <li>Ezen a héten a legjobb <strong><em>bármilyen</em></strong> képedet várjuk tőled. ${createPhotoUploadLink('Itt tudod majd feltölteni')}, ${formattedDeadline}-ig.</li>
    <li>Mindjárt vége a tanfolyamnak, de adunk pár ötletet a folytatáshoz.</li>
    <li>Hamarosan indul a következő kurzus, ajánld azoknak, akik örülnének neki.</li>
</ul>
<p><strong>Hosszabban:</strong>
</p>
<p>${createFullWidthImage('cranes.jpg', 'Darvak')}
</p>
<p>Tekintsünk vissza, mit csináltunk az elmúlt 12 héten:</p>
<ol>
    <li><strong>Gasztrofotók</strong>kal kezdtünk, átnéztük, hogyan készül egy beállított kép és ejtettünk pár szót a mesterséges megvilágításról.</li>
    <li><strong>Épületfotók</strong>kal folytattuk, gyakoroltuk a kinti fotózást és a kompozíciót. Az érdeklődőbbek megismerkedtek a blende és a záridő fogalmával.</li>
    <li><strong>Makrók</strong>at fotóztunk, közben megnéztük, mi az a bokeh, az érdeklődők a linkelt cikkekből tanultak a fókusztávolságról és mélységélességről.</li>
    <li><strong>Utcai fotózás</strong> következett, ahol megtanultuk egy kicsit összeszedni a bátorságunkat és elkapni a pillanatot.</li>
    <li><strong>Sportfotózás</strong> közben megtanultuk a gyorsan mozgó dolgok fényképezését, a záridő, blende és ISO érték beállításait.</li>
    <li><strong>Élőlényeket</strong> fotóztunk, ahol akár gyorsan mozgó állatokat, lassan mozgó növényeket, vagy makrókat, vicces képeket lehetett lőni.</li>
    <li><strong>Hosszan exponált képek</strong>kel gyakoroltuk a gépünk manuális („M”) üzemmódját használni, és gyakoroltuk az előző héten tanult elméletet.</li>
    <li><strong>Csendélet</strong>fotózással folytattuk, és a fehéregyensúly beállításait tanultuk meg.</li>
    <li><strong>Portrék</strong>at fotóztunk, ahol megpróbáltuk mások személyiségét, hangulatát elkapni és megörökíteni.</li>
    <li><strong>Eseményfotózás</strong>t tanultunk, hogy a party- és családi fotóink is profitáljanak a kurzusból.</li>
    <li><strong>Önarckép</strong>et készítettünk a múlt héten, újabb bátorságpróbaként 😊</li>
    <li>A héten pedig <strong>szabadon fotózunk</strong>.</li>
</ol>
<p>...mert bizony elérkezett a tanfolyam utolsó hete! Reméljük, sokat tanultál, kipróbáltál új dolgokat, közben sikerült néha elhagyni a komfortzónád, és még élvezted is. Most adunk egy utolsó feladatot, és néhány továbblépési lehetőséget, hogy ha szeretnéd, folytathasd a tanulást.</p>
<p><strong>A heti feladatról:</strong>
</p>
<p>Most, hogy megtanultál mindent, amit csak a fényképezésről tudni lehet 😉, szabadjára engedünk, fotózz, amit csak szeretnél. A cél, hogy bemutathasd, mit tanultál, és mi jelenleg a kedvenc stílusod. Ha ez segít, gondolj rá úgy, mint egy diplomamunkára. Ha ez inkább frusztrál, akkor ne gondolj rá úgy. 😀 Talán mostanra kialakult benned egy érzés, hogy melyik téma állt legközelebb hozzád az elmúlt hetekben. Vagy valami, amit nem érintettünk, de jó lett volna?</p>
<p>Pár tipp, hogyan találd meg a témád:</p>
<ul>
    <li><strong>Mi érdekel most a legjobban? </strong>Van olyan, ami rögtön eszedbe jut erre a kérdésre? Vagy érzed valamivel kapcsolatban a bizsergést, hogy „De jó lenne lefotózni”? (Ha nem, semmi gond, van még néhány ötletünk a tarsolyban.)</li>
    <li><strong>Mi az üzeneted?</strong> Mit tartasz fontosnak? Mi áll hozzád közel? A pandák megmentése? Szegénység az utcákon? Fel akarod vidítani az embereket? (Ha most épp nem fedezel fel magadban különösebb mondanivalót, olvass tovább.)</li>
    <li><strong>Milyen esztétika mozgat meg?</strong> A mozgás, akció? Az emberi testek vagy arcok? Különböző életérzések? Sorsok? Épített geometria? A hétköznapi élet örömei? Apró teremtmények? Természet, természeti jelenségek? A divat?</li>
    <li><strong>Mit fotóznál rendszeresen? </strong>Milyen témában érzed azt, hogy érdekel annyira, hogy akár napi vagy heti szinten fotóznád és nem éreznéd megterhelőnek, inkább érdekesnek? Mit tudnál elképzelni, hogy a szokásoddá váljon?</li>
    <li><strong>Milyen reakciót szeretnél kiváltani az emberekből? </strong>Azt szeretnéd látni, hogy az emberek… gyönyörködnek? Elgondolkoznak? Megdöbbennek? Éhesek lesznek?</li>
    <li><strong>Melyik téma volt a kedvenced?</strong> Ezek voltak: gasztrofotó; épületek; makrók; utcai fotózás; sportfotók, gyors dolgok; hosszú exponálási idő; csendélet; állatok, növények; portré; eseményfotózás; önarckép. Akár végigmehetsz a galériákon, és ihletet meríthetsz mások beküldött képeiből. A fotózásban még a másolás sem ciki, hiszen, minden igyekezet ellenére, nincs két egyforma fénykép.</li>
    <li><strong>Fotózz krumplikat.</strong> Ha egyik fenti kérdés sem hozott ihletet, és egészen nincs ötleted, fotózz krumplikat. Krumplik mindenütt vannak, és mint a fotók esetében, a krumplik közül is mindegyik más. 😊 🥔🥔</li>
</ul>
<p>A legjobb képedet ${formattedDeadline}-ig, ${createPhotoUploadLink('itt tudod majd feltölteni')}.</p>
<p><strong>Arról, hogy hogyan folytasd a tanulást:</strong>
</p>
<p>Úgy gondoljuk, ha tetszett ez a 12 hetes tanfolyam, talán szívesen folytatnád a tanulást (most vagy később) hasonló napi/heti kihívásokkal és kurzusokkal. Összeszedtünk neked néhányat a legjobbak közül, viszont sajnos nem találtunk másik magyar nyelvű ingyenes tanfolyamot, így ezek mind vagy fizetősek, vagy angol nyelvűek – de mind színvonalasak. Reméljük, ha folytatnád a tanulást, találsz közülük szimpatikusat.</p>
<p>Napi/heti kihívások:</p>
<ul>
    <li><a href="https://www.flickr.com/groups/365days/">365 önarckép</a> (angol) – egy kis közösség, akik minden nap beküldenek egy önarcképet.</li>
    <li><a href="https://www.techradar.com/how-to/52-photography-projects-a-great-technique-to-try-every-week-of-the-year">52 heti fotóötlet</a> (angol, de képekkel) – ha a Photato koncepcióját folytatnád.</li>
    <li><a href="https://digital-photography-school.com/7-photography-projects-to-jumpstart-your-creativity/">7 projekt-ötlet</a> (angol) – 7 további ötlet: napi önarckép; heti fotós séta; 100 fotó ismeretlen emberekről; egy fotó az abc minden betűjére (a „Q” egész trükkös lehet); sok fotó egy témáról; napi fekete-fehér fotó egy hónapig; listaírás és végigfotózás.</li>
</ul>
<p>Tanfolyamok:</p>
<ul>
    <li><a href="https://www.onlinefototanfolyam.hu/">Online fotótanfolyam</a> (magyar, 19.900 ft) – A 67 leckéből az első 5 ingyen van, így ingyen megnézheted, tetszik-e.</li>
    <li><a href="https://fotozasblog.hu/">Fotózás lépésről lépésre</a> (magyar, 4.500 ft) – Egy blog, leírásokkal és magyarázatokkal, melyeknek egy része ingyenes, más része egy online megvásárolható digitális könyvben elérhető.</li>
    <li><a href="https://digital-photography-school.com/">Digital Photography School</a> (angol) – Fotós suli heti tippekkel és hasznos cikkekkel kezdőtől profi szintig.</li>
    <li><a href="https://gurushots.com/">Gurushots</a> (angol) – Szépen felépített, játékos oldal folyamatos kihívásokkal és akár pénzdíjas versenyekkel.</li>
</ul>
<p><strong>A Photatoról:</strong>
</p>
<p>Köszi, hogy részt vettél a kurzuson! Mi nagyon élveztük, örültünk a rengeteg pozitív visszajelzésnek és konstruktív kritikának. 😊 Még nem búcsúzkodunk, hiszen még van egy hét, és egy fotókiállítás, amiről hamarosan írunk! Viszont akartunk szólni, hogy hamarosan újabb tanfolyamot indítunk. Sokan írtátok, hogy szívesen ajánlanátok a Photatot a barátaitoknak/kollégáitoknak. Gondoltuk, ez egy remek alkalom, hogy lehetőséget adjunk erre.</p>
<p>Itt van pl. egy rövid üzenet, amit átküldhetsz azoknak, akiket szerinted érdekelhet:</p>
<hr>
<p><em>Képzeld, az elmúlt hetekben fotózni tanultam egy online suliban, és pár hét múlva indul egy újabb kurzusuk!<br />
    Arra gondoltam, téged is érdekelhet a fotózás.<br />
    Ha így van, lájkold az oldalt és nyomj rá a Feliratkozás gombra itt: <a href="https://bit.ly/12712fbpage">https://bit.ly/12712fbpage</a></em>
</p>
<hr>
<p>Vagy kiírhatsz valami ilyesmit a faladra:</p>
<hr>
<p><em>Az elmúlt hetekben fotózni tanultam egy ingyenes, online suliban, és nagyon király volt. Hamarosan indul a következő kurzusuk, ajánlom mindenkinek! Ha érdekel, lájkold az oldalt és nyomj rá a Feliratkozás gombra itt: <a href="https://bit.ly/12712fbpage">https://bit.ly/12712fbpage</a></em>
</p>
<hr>
<p>A feladatok a tervek szerint a következő tanfolyamon is nagyon hasonlóak lesznek a mostanihoz, szóval ha már egyszer végigcsináltad, nem feltétlenül ajánljuk újra, de ha nem adtál be annyi képet, mint tervezted, és megpróbálnád ismét, bátran iratkozz fel a következő körre itt: <a href="http://bit.ly/12712signupc1">http://bit.ly/12712signupc1</a>
</p>
<p>És még egy dolog:</p>
<p><strong>Mentorokat keresünk!</strong> Sokan jeleztétek, hogy jó lett volna több visszajelzés a képeitekre, viszont nekünk sajnos nem volt erre annyi időnk, mint szerettük volna. Ha érzed magadban az erőt, hogy besegíts nekünk kommentálni a beérkező képeket, küldj egy levelet a <a href="mailto:photatophotato+mentor@gmail.com">photatophotato+mentor@gmail.com</a> címre. Egy egy soros email teljesen elég, hogy „Mentornak jelentkezem”, a többiről emailben egyeztetünk. Nem hatalmas felelősség, de nekünk nagy segítség. 😊</p>
<p>Hát, így. 😊</p>
<p>Ha még nem küldted be a múlt heti (önarckép) képedet, ma éjfélig még azt is ${createPhotoUploadLink('megteheted')}. 🕚</p>
<p>Az e heti képeket pedig ${createPhotoUploadLink('itt')} várjuk!</p>
<p>Jó fotózást,</p>
<p>--<br />
    a Photato csapata</p>`;
}