import React from '../../../web_modules/react.js';
import SimpleFigure from '../../components/SimpleFigure.mjs';
import ExternalLink from '../../components/ExternalLink.mjs';

// noinspection JSUnusedGlobalSymbols (This file is loaded dynamically.)
/**
 * @returns {ArticleMetadata}
 */
export function getMetadata() {
    // noinspection SpellCheckingInspection (It's in Hungarian.)
    return {
        slug: 'vaku-a-hosszu-expozicios-ideju-fotozas-alapjai',
        title: 'A hosszú záridős fotózás alapjai',
        author: 'gorbelabda',
        publishDate: new Date('2017-07-25'),
        publisherName: 'Vaku.hu',
        originalUrl: 'https://vaku.hu/2017/07/25/a-hosszu-expozicios-ideju-fotozas-alapjai/',
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
        <p>Ebben az átfogó útmutatóban megismerkedhetsz a hosszú expozíciós képek készítésével <strong>Colby Brown</strong> útmutatásával. Ő végigvezet a tervezési folyamaton, a szükséges eszközökön és technikákon, ami szükséges ezeknek a lélegzetelállító képeknek az elkészítéséhez. Egy kis kreatív előkészítés, egy erős, megbízható állvány és csak az ég szabhat határt, hogy mit alkotsz.
        </p>
        <SimpleFigure fileName="20160305_Iceland_4823-Edit-2-1280x860-1-1024x688.jpg" alt="Illusztráció"/>
        <p>
            <em>Colby Brown fotográfus, oktató és szerző kelet Pennsylvániából. Táj, utazás és humanitárius fotózásra specializálódott, a portfóliója átfogja az egész világot. A munkáin keresztül megfigyelhetjük hogyan ötvözi a természeti környezet iránti rajongást az emberi kultúrák sokfélesége iránti csodálattal. 2011-ben megalakította a Giving Lens (TGL) szervezetet, melynek célja a harc a gyermekek oktatásáért, a tiszta ivóvíz megóvásáért, a nők jogaiért, stb. Az ügyfelei közé tartozik a teljesség igénye nélkül a Sony, Samsung, Toshiba, Visit California.</em>
        </p>
        <p>Amikor egy fotós elkezdi megismerni a különböző technikákat bizonyos esetekben a hosszú expozíciós képek készítése megzavarja. Eltér a más fotózási technikáktól, bosszantó kísérletezni, további eszközökre van szükség a megfelelő hatás eléréséhez és még rengeteg kreatív döntés meghozatala is szükséges, amely jelentősen megváltoztatja a kép megjelenését.</p>
        <SimpleFigure fileName="20160629_Iceland_Summer_08551-Edit-1024x683-1024x683.jpg" alt="Illusztráció"/>
        <p>Ennek a cikknek a lényege, hogy végigvegyük a mozgás hatását a képeken, a szükséges fotós felszerelést, és elmélyedünk a különböző hosszú expozíciós témák világában sok tippet és trükköt bemutatva.</p>

        <h2>A mozgás ereje</h2>
        <p>Amikor találkozunk az expozíciós háromszöggel (zársebesség, rekesz, érzékenység) fontos, hogy megértsük mindhárom tényező fontosságát a kép elkészítésében. A rekesz felel a megfelelő mélységélességért, az ISO a színmélységért és a megfelelő fény érzékenységért, a zársebesség pedig a mozgás mértékért.
            <br/> Ha belegondolsz sok esetben a mozgás az ami feszültséget kelt vagy érzelmet vált ki egy kép láttán. Hagyd a zársebességet hosszúra és megragadod a téma mozgását, áramlását így adva lendületet, sokszor álomszerű hatást a képnek.
        </p>
        <SimpleFigure fileName="20160305_Iceland_4823-Edit-2-1280x860-1-1024x688.jpg" alt="Illusztráció"/>
        <p>Mint más területeken a fotózásban itt is sok kreatív döntést kell meghozni. Van választásod. Az 1 másodperces expozíció nagyban különbözik a 30 másodperces expozíciótól…</p>

        <h2>Szükséges eszközök</h2>

        <h3>Fényképezőgép</h3>
        <p>Olyan nyilvánvaló, mint ahogyan hangzik. 🙂 Igen, szükségünk van egy fényképezőgépre, hogy hosszú expozíciós képeket készíthessünk. Amire viszont szükséged lesz, hogy Manuális módban tudd a zársebességet állítani legalább 30 mp-ig. Ez lehet egy kis zsb fényképezőgép egy nagy DSLR vagy a manapság divatos tükör nélküli fényképezőgépek mint pl. A Sony a7R II. (Ezt a típust használja a szerző fő fényképezőgépeként).</p>
        <SimpleFigure fileName="IMG_20170413_082728-1024x683-1024x683.jpg" alt="Illusztráció"/>
        <p>Napjainkban számos telefon fényképezőjének szoftverében megjelentek az expozíciós adatok állítási lehetősége. Függetlenül attól, hogy milyen fényképezőgépet vagy telefont használsz elengedhetetlen, hogy a zársebességet állítani tudd akár a fényképezőgép Manuális vagy Zársebesség prioritás módjában.</p>
        <SimpleFigure fileName="20150415_223859-Edit-1024x576-1024x576.jpg" alt="Illusztráció" caption="LG G4 telefonnal készült kép"/>
        <p>A legtöbb modern fényképezőgépben a maximális zársebesség 30 másodperc, de lehetőség van a “bulb” záridő használatára, itt akár percekig, vagy órákig is tarthat egy expozíció. Ez esetben viszont biztos, hogy szükség lesz egy vezetékes vagy vezeték nélküli távkioldóra. (Erről majd később).</p>

        <h3>Állvány</h3>
        <p>Néhányan a világ legjobb fotósai közül képesek 1/10 másodperces zársebességet is kitartani egy széles látószögű objektívvel (sokszor segít a szenzor mozgatásos vagy objektívbe épített képstabilizátor) úgy, hogy az tökéletesen éles de egy 20 másodperces expozíciót lehetetlen elmosódás nélkül. A lélegzés, az apró mozdulatok továbbá a külső tényezők mint a szél mind bemozduláshoz vezetnek. Ebben az esetben muszáj a fotósnak egy minőségi állványt használni és ehhez csatlakoztatni a fényképezőgépet. Bizonyos esetekben használhatsz tereptárgyakat is állványként, egy asztalt vagy egy stabil követ de ezekben az esetekben nem lesz meg az a kompozíciós szabadság mint egy profi állvány esetén.</p>
        <SimpleFigure fileName="20160701_Iceland_Summer_08839-1024x683-1024x683.jpg" alt="Illusztráció"/>

        <h3>Mit érdemes figyelembe venni egy állványnál?</h3>
        <p>Maximális szilárdság
            <br/> A szerző első számú választása arra az esetre ha a maximális stabilitásra vágyik az <strong>INDURO GIT304L</strong> típusú karbon állvány <strong>BHL2</strong> gömbfejjel. Elmondása szerint akár szeles vagy extrém környezetben is sziklaszilárd marad ez az összeállítás. Bár a szállítási mérete nem kisebb a hasonló állványoknál, de a karbon kivitel miatt súlya csekély és magassága is megfelelő.
        </p>
        <SimpleFigure fileName="GIT304L_Open-225x300-1.jpg" alt="Illusztráció"/>
        <p>
            <strong>Könnyű és hordozható</strong><br/>
            Amikor számít a tömeg akkor Colby a sokkal kisebb <strong>INDURO CLT104</strong> karbon állványát használja <strong>BHL</strong>1 gömbfejjel. Ez az összeállítás kényelmesen elfér a legtöbb fotós táskához csatolva. Kompromisszumot kell kötni, mivel ez egy könnyen szállítható állvány a magassága nem éri el az előbb említett GIT304L típusét, stabilitása viszont ennek is kiemelkedő.
        </p>
        <SimpleFigure fileName="CLT104_Straight-225x300-1.jpg" alt="Illusztráció"/>

        <h3>L-bracket</h3>
        <p>Egy árához képest igen hasznos fém tartókonzol. Segítségével könnyű váltani a vízszintes és függőleges géphelyzet között.</p>
        <SimpleFigure fileName="IMG_20160404_112201-1024x683-1024x683.jpg" alt="Illusztráció"/>
        <p>Az L-bracket a fényképezőgép alján lévő állványcsatlakozásba rögzíthető és Arca-Swiss kompatibilis állvány fejekkel használható.</p>

        <h3>Szűrők</h3>
        <p>Egyes fotósok előszeretettel használják az utómunka adta lehetőségeket a szűrők helyettesítésére de bizonyos helyzetekben inkább csak a baj van ezekkel a megoldásokkal és nem képesek kiváltani az igazi szűrők hatását. Az ND szűrők és a cirkuláris polár szűrők hatása jelenleg nem leutánozható számítógépes szoftverekkel.</p>
        <p>Melyek ezek a szűrők?</p>
        <SimpleFigure fileName="IMG_20170301_170520-1024x683-1024x683.jpg" alt="Illusztráció"/>

        <h3>ND szűrők</h3>
        <p>Az egyik legfontosabb szűrő a hosszú záridős fotózáshoz az ND azaz semleges szürke szűrő. Gyakorlatilag egy sötétített üvegről van szó, melynek feladata, hogy csökkentse az objektíven át bejutó fény mennyiségét. Mi az értelme ennek? Minél több fényre van szükség annál hosszabb záridő is szükséges.</p>
        <SimpleFigure fileName="20150620_Iceland_5214-Edit-1024x683-1024x683.jpg" alt="Illusztráció"/>
        <p>Különböző áteresztő képességű ND szűrők léteznek, van olyan amelyik egy fényértékkel (ND1), van ami néggyel (ND4) stb. csökkenti a bejutó fény mennyiségét. Lehetőség van az ND szűrőkből egy időben többet is használni ezáltal extrém hosszú záridők érhetőek el még akkor is ha tűző napsütésben fotózunk.</p>

        <h3>Cirkuláris Polár szűrő (CPL)</h3>
        <p>Az ND szűrő mellett a legtöbbször használt szűrő a Cirkuláris Polár. Ezt az objektív szűrőmenetébe lehet feltekerni és fokozza vagy eltünteti a reflexiókat a képekről. Például ha egy tóparton fotózunk és szeretnénk a vízben lévő sziklákhoz belátni vagy egy esti naplemente vízparton egy szikláról a tükröződést felerősíteni.</p>
        <SimpleFigure fileName="20160306_Iceland_4959-Edit-1-683x1024-683x1024.jpg" alt="Illusztráció" caption="ND és CPL szűrő kombinálása"/>
        <p>További előnyei a CPL szűrőnek:</p>
        <ul>
            <li>kiemeli a szivárványokat</li>
            <li>eltünteti a fényes tükröződéseket a sziklákról a vízesések mentén</li>
            <li>kontrasztosabbá teszi a felhőket</li>
            <li>növeli a kék és zöld színek kontrasztját</li>
        </ul>

        <h3>Colby Brown tájkép szűrő kit (Format Hitech)</h3>
        <p> Kifejezetten tájfotósoknak kifejlesztett szűrő készlet, mely a szűrő tartón kívül tartalmaz egy beépített CPL szűrőt, 6 F-stop ND szűrőt, 2 F-stop lágy GND (átmenetes szürke szűrő), 2 F-stop RGND szűrő (fordított átmenetes szürke szűrő).</p>
        <SimpleFigure fileName="IMG_20170525_153823-1024x683-1024x683.jpg" alt="Illusztráció"/>

        <h3>Távkioldó</h3>
        <p>Bár egy stabil állvány sarkalatos pontja a tökéletes élességű hosszú expozíciós képek készítéséhez, ez az olcsó kiegészítő még sokat segíthet. Amikor a fényképezőgépet tökéletesen beállítottunk az állványon és megnyomjuk az exponáló gombot ez berázhatja a gépet ezzel felesleges bemozdulást okozva. Ennek kiköszöbölésére ideális egy vezetékes vagy vezeték nélküli távirányító. A legtöbb fényképezőgép támogatja a távoli kioldást így elkerülve a fizikai kontaktot a fényképezőgéppel.</p>
        <SimpleFigure fileName="PH18300_04-300x300.jpg" alt="Illusztráció"/>
        <p>Akkor ha nincs távkioldónk mindenképp ajánlatos használni az exponálás késleltetés funkciót. A legtöbb gépen választható, hogy 2, 5 vagy 10 másodperces késleltetéssel exponáljon gépünk a gomb lenyomását követően. Ez a késleltetés elegendő ahhoz, hogy a gomb lenyomása által keletkezett rezgések megszünjenek.</p>
        <p>További előnye a távkioldónak, hogy “Bulb” módban nem kell folyamatosan nyomnunk az exponáló gombot, ami ugye berázáshoz vezethet.</p>

        <h3>Alkalmazások</h3>
        <SimpleFigure fileName="PlayMemories-1024x843-1024x843.jpg" alt="Illusztráció"/>
        <p>Keresd fel a <ExternalLink href="https://www.playmemoriescameraapps.com/portal/">Play Memories Camera Apps</ExternalLink> -t további infókért!
        </p>
        <p>Ez a két applikáció igazán hasznos lehet (ha Te is Sony fényképezőgépet használsz).</p>
        <ul>
            <li>Smart Remote (FREE)</li>
            <li>Smooth Reflections</li>
        </ul>

        <h2>Gyakorlati tippek a hosszú expozíciós fotózáshoz</h2>
        <p>
            <em>A hosszú expozíciós fotózás különböző vállfajaihoz különböző technikák szükségesek. Nézzük meg a legnépszerűbbeket.</em>
        </p>

        <h3>Vízesések</h3>
        <p>Az egyik legnépszerűbb téma nem véletlenül. A mozgó víz, a drámai sziklák és a gyakran búja zöld környezet igazán vonzó lehet a tájfotósok számára.</p>
        <SimpleFigure fileName="20160709_Iceland_Summer_01839-Edit-1024x683-1024x683.jpg" alt="Illusztráció"/>

        <h4>Ajánlott objektív</h4>
        <p>A legtöbb esetben egy széles látószögű objektív a legmegfelelőbb például ami a 16-35mm gyújtótávolságot lefogja. Mivel a mélységélesség fontos nem szükséges nagy fényerejű objektívet választani úgyis rekeszelni szükséges.</p>
        <SimpleFigure fileName="20160701_Iceland_Summer_08911-Edit-1024x683-1024x683.jpg" alt="Illusztráció" caption="16-35 F/4 objektív @ 17mm"/>

        <p>
            <strong>Az ideális beállítás Colby szerint:</strong> ISO100 / F/11 / 0,5-2 mp
        </p>
        <p>Mint a legtöbb esetben itt is célszerű a legalacsonyabb ISO értéket választani, ez teszi lehetővé a legélénkebb színek és a legtöbb részlet megjelenését a képen. A megfelelő mélységélesség miatt célszerű F/8 – F/11 rekesz értéket választani.</p>
        <SimpleFigure fileName="20150618_Iceland_5021-Edit-1024x683-1024x683.jpg" alt="Illusztráció" caption="1.3 másodperces záridővel készült kép"/>
        <p>Néhány fotós szívesen választ 5 vagy 10 másodperces záridőket a teljesen álomszerű hatásért, Colby viszont előszeretettel marad aa 0.5 és 2 másodperc közötti időknél, mivel így megmarad a víz bizonyos szintű textúrája.</p>

        <h4>Tippek és trükkök</h4>
        <p>
            <strong>Keress olyan vonalakat amik vezetik a szemet!</strong> A néző tekintetét könnyebb a kép lényegére fókuszálni ha ezek a vonalak a téma felé vezetnek. Például egy út ami végigviszi a néző szemét az egész képen ezáltal felfedezhet finom rejtett részleteket.
        </p>
        <SimpleFigure fileName="DX_7114-Edit-Recovered-1024x682-1024x682.jpg" alt="Illusztráció"/>
        <p>
            <strong>Ne ijedj meg álló formátumú képek készítésétől sem:</strong> Sok fotós ragaszkodik a fekvő formátumhoz, de az álló képekkel még nagyobb mélységet lehet kölcsönözni a képeinkbe. Olyan hatást kelt mintha ott lennénk.
        </p>
        <SimpleFigure fileName="20150622_Iceland_5528-Edit-Edit-683x1024-683x1024.jpg" alt="Illusztráció"/>

        <h3>Tengerparti tájképek</h3>
        <p>Egy másik nagyon népszerű ága a hosszú expozíciós fotózásnak. Ezek a képek magukba foglalják az óceán vagy tó partját gyakran keverve sziklás előtérrel és gyorsan mozgó vízzel.</p>
        <SimpleFigure fileName="20160220_Norway_2053-Edit-1024x683-1024x683.jpg" alt="Illusztráció"/>
        <p>
            <strong>Próbáld meg minden esetben fényképezőgéped és objektívjeid megmenteni a sós víztől!</strong>
        </p>

        <h4>Ajánlott objektív</h4>
        <p>Hasonlóan a vízesések fotózáshoz itt is jól jön a 16-35mm gyújtótávolság. A biztonságos távolság megléte miatt (ár-apály jelenség, vagy nagy hullámok) jól jöhet 24-70mm átfogású objektív.</p>
        <SimpleFigure fileName="20150228_Iceland_1444-Edit-1024x683-1024x683.jpg" alt="Illusztráció" caption="16-35 mm F/4 objektív @ F/16"/>
        <p>
            <strong>Az ideális beállítás Colby szerint:</strong> ISO100 / F/11 – F/16 / változó zársebesség
        </p>
        <p>Gyakorlatilag ugyanaz mondható el mint a vízesés fotózásnál leírtaknál. Törekedni kell az alacsony érzékenységre, a mélységélesség miatt az F/11 – F/16 rekeszre. Az idővel pedig a mozgás mértéke befolyásolható.</p>
        <SimpleFigure fileName="20150310_Norway_3462-Edit-1024x683-1024x683.jpg" alt="Illusztráció" caption="ISO100 / F/11 / 1.6 mp"/>

        <h4>Tippek és trükkök</h4>
        <p>
            <strong>Használj gumicsizmát:</strong> Nem csak a felszerelés megóvása a fontos, de a gumicsizma segítségével könnyen szárazon tartható a lábunk. Nagyon fontos a felszerelésed óvd a sós víztől.
        </p>
        <SimpleFigure fileName="BrianMatiash_20150227-DSC04589-1-1024x683-1024x683.jpg" alt="Illusztráció"/>
        <p>
            <strong>Az időzítés kulcsfontosságú: </strong> Amikor mozgó tárgyakat fotózunk az időzítés kulcsfontosságú. Colby gyakran készít 6-7 expozíciót egy sorozatban ahogy egy hullám jön majd visszavonul a tengerbe. Minden kép más és más, nincs két egyforma.
        </p>
        <SimpleFigure fileName="20160309_Iceland_5392-Edit-Edit-1-1024x683-1024x683.jpg" alt="Illusztráció"/>

        <h3>Utazás / Építészet</h3>
        <p>A fotósok többsége szeret utazni. Ahogy elhagyjuk a saját városunkat, országunkat izgatottá válunk a körülöttünk lévő világtól. Amikor egy egyedi szituációval találkozunk hasznos lehet itt is a hosszú expozíció.</p>
        <SimpleFigure fileName="20131103_Myanmar_6907_EDIT-1024x683-1024x683.jpg" alt="Illusztráció"/>

        <h4>Ajánlott objektívek</h4>
        <p>Ezen területen praktikus lehet egy széles látószögű objektív (16-35mm) egy alap zoom (24-70mm) és egy tele objektív (70-200mm) attól függően milyen közel vagy távol van a téma.</p>
        <SimpleFigure fileName="20140608_Australia_3436-Edit-1024x512-1024x512.jpg" alt="Illusztráció" caption="70-200mm F2.8 objektív"/>
        <p>
            <strong>Az ideális beállítás Colby szerint:</strong> ISO100 / F/2.8 – F/11 / hosszú zársebesség
        </p>
        <p>Miközben az alacsony érzékenységre törekszünk segítségünkre lehet a megfelelő rekesz érték kiválasztása függően a fény mennyiségétől. Egy hosszabb záridő választása segít létrehozni pár speciális effektet, például az emberek mozgásának elmosódását vagy a felhők áramlását.</p>
        <SimpleFigure fileName="20121203_Jordan_7795-Edit-1024x683-1024x683.jpg" alt="Illusztráció" caption="ISO500 / F5.6 / 15 mp"/>

        <h4>Tippek és trükkök</h4>
        <p>
            <strong>A kék óra a Te barátod:</strong> Colby egyik kedvenc időszaka a városképek elkészítéséhez a kék óra azaz a naplementét követő egy óra. A nappal és éjszaka átmenete között könnyű megtalálni az egyensúlyt a megfelelő fényhez és kontraszthoz.
        </p>
        <SimpleFigure fileName="DX_1515-Edit-Edit-2-1024x683-1024x683.jpg" alt="Illusztráció"/>
        <p>
            <strong>Az emberek legyenek mozgásban a képen:</strong> Sok fotós megpróbálja eltávolítani az embereket a képről. Tedd a géped egy állványra válassz egy hosszú záridőt és használd ki a képed drámaibbá tételéhez az emberek elmosódott mozgását.
        </p>
        <SimpleFigure fileName="20150203_Japan_0566-Edit-1024x683-1024x683.jpg" alt="Illusztráció"/>

        <h3>Éjszakai fotózás</h3>
        <p>Messze az egyik legnépszerűbb felhasználási terület a hosszú záridős képekhez az éjszakai fotózás. Van valami különleges a végtelen tér és a természetben előforduló jelenségek fotózásában, például a sarki fény, vagy bármelyik korábban említett fotózási terület keverése az éjszakai fotózással.</p>
        <SimpleFigure fileName="20140207_Iceland_0663-Edit-Edit-1-1024x683-1024x683.jpg" alt="Illusztráció"/>

        <h4>Ajánlott objektívek</h4>
        <p>Mivel az éjszakai fotózás nagyon sötét környezetben történik praktikus a nagy fényerejű objektívek választása (F2,8 vagy nagyobb). Remek pár lehet itt is egy széles látószögő objektív (16-35mm).</p>
        <SimpleFigure fileName="20120609_Bolivia_1421-Edit-1024x681-1024x681.jpg" alt="Illusztráció"/>

        <h4>Az ideális beállítás Colby szerint</h4>
        <p>Lehetséges legkisebb érzékenység / nyitott rekesz / 4 – 30 mp záridő</p>
        <p>A sötétség miatt az ISO100 érzékenység valószínüleg kevés lesz célszerű inkább ISO800 és ISO3200 között megválasztani. Dolgozzunk nyitott rekesszel. A záridőt pedig helyzettől függően 4 és 30 mp közé tegyük.</p>
        <SimpleFigure fileName="20151109_Iceland_0054-Pano-Edit-1-1024x683-1024x683.jpg" alt="Illusztráció" caption="ISO1000 / F/2 / 15mp @ 25mm"/>

        <h4>Tippek és trükkök</h4>
        <p>
            <strong>A győzelemhez szükség lesz kézi élesség állításra:</strong> Az egyik legnehezebb kihívás a kevés fény miatt az élesség állítás, a fényképezőgépek AF rendszere jellemzően nem képes ilyen sötétben élességet állítani. Keress egy kontrasztos színt vagy vonalat és próbálj meg arra élességet állítani, mivel elég messze lesz sok esetben elég az élességet a végtelenre állítani.
        </p>
        <SimpleFigure fileName="20150303_Norway_8212-1024x684-1024x684.jpg" alt="Illusztráció"/>
        <p>
            <strong>Hagyd, hogy az ég uralkodjon a képen:</strong> Colby szereti ha az éjszakai kép nagy részét az ég teszi ki, persze fontos, hogy valami érdekes izgalmas téma legyen az előtérbe. Emiatt előszeretettel használ nagy látószögű objektívet.
        </p>
        <SimpleFigure fileName="20160306_Iceland_2417-Edit-Edit-684x1024-684x1024.jpg" alt="Illusztráció"/>
        <p>
            <ExternalLink href="http://pushfurther.indurogear.com/2017/07/18/learn-the-fundamentals-of-long-exposure-photography/">Az eredeti cikket itt olvashatod!</ExternalLink>
        </p>
    </>;
}