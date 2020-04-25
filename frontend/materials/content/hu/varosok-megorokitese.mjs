import {createElement} from '../../../web_modules/react.js';
import htm from '../../../web_modules/htm.js';
import TwoEnlargeableFigures from '../../components/TwoEnlargeableFigures.mjs';
const html = htm.bind(createElement);

// noinspection JSUnusedGlobalSymbols (This file is loaded dynamically.)
/**
 * @returns {ArticleMetadata}
 */
export function getMetadata() {
    return {
        slug: 'varosok-megorokitese',
        title: 'Városok megörökítése',
        author: 'Gábor Zoltán',
        publishDate: new Date('2006-04-05'),
        publisherName: 'Sg.hu',
        originalUrl: 'https://sg.hu/cikkek/it-tech/43737/hogyan-fotozzunk-varosok-megorokitese',
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
    <p>A digitális géppel rendelkező fotósok legtöbbje városban él, illetve városokat látogat meg utazásai során, így a városok, nevezetességek fotózása az egyik legkedveltebb téma. Lássuk, hogyan oldjuk meg a feladatot!</p>
    <h2>Beállítások, alapszabályok</h2>
    <p>Először is felejtsük el a klasszikus családi utazási képeket! Amennyiben mégsem szeretnénk kihagyni azokat, elkészültük után szánjunk egy kis időt a család, feleség, barátnő nélküli fotók készítésére. Egy idegen városban rengeteg látnivaló, téma akad, így nem árt, ha egy egész napot (vagy többet) adunk magunknak a témák megtalálására, a város ritmusának felvételére, a fotók elkészítésére (amennyiben vagyunk annyira elhivatottak).</p>
    <p>Fényképezőgépünk beállításait már kiveséztük előző cikkeinkben, de a városi fotózáshoz nem árt néhány alapszabályt betartanunk. Először is, vigyünk magunkkal állványt! Nem jó érzés, mikor alkonyatkor kénytelenek vagyunk abbahagyni a fotózást, hiszen ilyenkor teljesen más arcát mutatják a városok, nevezetességek (pl. kék óra). Amennyiben tükörreflexes gépünk van, nagylátószögű objektívet csavarjunk rá. Kompakt gép esetében lehetőségeinkhez képest használjunk nagylátószögű konvertert, mert a nagy épületeket csak ezekkel az objektívekkel tudjuk egy képbe foglalni.</p>
    <${TwoEnlargeableFigures} thumbnailFileName1="0404_varos1_200.jpg" fullSizeFileName1="0404_varos1.jpg" altText1="Város 1" thumbnailFileName2="0404_varos2_200.jpg" fullSizeFileName2="0404_varos2.jpg" altText2="Város 2" />
    <p><br />Amennyiben napsütésben indulunk útnak, válasszuk a legalacsonyabb ISO-érzékenységet. A mátrix-fénymérés városban a legtöbb témánál jó eredményt ad, de persze dolgozhatunk manuális módban is. Amennyiben szeretnénk a legnagyobb részletességű képet kapni és a fényviszonyok megengedik, lehetőleg válasszunk közepes rekeszértéket (nappal az állvány jó szolgálatot tesz ilyenkor). A fehéregyensúly lehet automata is, de a napfény beállítás is kielégítő, amennyiben süt a nap. Felhős időben természetesen a felhős beállítást válasszuk. Ha gépünk beállításaival végeztünk, irány felkutatni a témákat.</p>
    <h2>Komponálás</h2>
    <p>Amennyiben lehetséges, fotózás előtt járjuk körül a témát. Keressük meg a lehető legjobb, legérdekesebb látványt nyújtó helyeket. Ne csak a puszta szemünkkel nézzünk körül, emeljük magunk elé a gépet és a keresőn keresztül komponáljunk. Ha zoommal is rendelkezik az objektív, minden állást próbáljunk ki bezoomolva is. Érdekes és nagyon szép részleteket emelhetünk így ki. Próbáljunk meg olyan fotót készíteni a témáról, amilyet még nem láttunk róla. Persze ez nehéz, de a könnyebbik út nem vezet akkora sikerélményhez. Ha úgy érezzük, feküdjünk le a földre, menjünk olyan közel amennyire tudunk és próbáljuk meg 'bogárszemmel' fotózni a témát. Magas épületeknél ez a beállítás még inkább kiemeli az épület méreteit.</p>
    <${TwoEnlargeableFigures} thumbnailFileName1="0404_varos3_200.jpg" fullSizeFileName1="0404_varos3.jpg" altText1="Város 3" thumbnailFileName2="0404_varos4_200.jpg" fullSizeFileName2="0404_varos4.jpg" altText2="Város 4" />
    <p><br />Egy nyaraláson vagy hétvégi kiruccanáson természetesen egyetlen dologból van a legkevesebb, mégpedig az időből. Mindent látni akarunk, de csak pár napunk van rá, és még pihennénk is. Mindezeket figyelembe véve igyekezzünk céltudatosan fotózni. Induljunk el napfelkeltekor, mert a hajnali fények sokkal barátságosabbá, érdekesebbé, színesebbé teszik a városképeket. Természetesen hasonló helyzet áll fenn napnyugtakor. A két időpont közé lehet a vásárolgatást és egyéb - fényképezőgépet nem igénylő - teendőket ütemezni. Kerüljük a déli napfényt (nem csak fotózás szempontjából) és a felhős időt is. Felhős időben minden színtelenebb, szürkébb, élettelen, ráadásul a kevesebb fény miatt hosszabbakat is kell exponálnunk.</p>
    <p>Az épületek és nevezetességek fotózásakor nagylátószöggel leszünk a leghatékonyabbak, de ennek is van egy nagy hátránya, amit perspektívatorzításnak hívunk. Minél nagyobb látószöget fog be egy objektív, annál jobban torzítja a teret. Természetesen van olyan helyzet és téma, amit nem tudunk nagylátószög nélkül egy fotóba foglalni, de ha tehetjük próbálkozzunk zoomolni az objektívünkkel. 38 mm-es fókusztávolságnál már jóval kevésbé zavaró ez a hatás, és távolabbról fotózva a témánkat kiegyenesíthetjük a képszéleket. Figyeljünk az előtérre is. Feldobhatjuk képeinket, ha valami érdekeset, jellegzetest komponálunk az előtérbe, így kellemesebbé, tartalmasabbá tehetjük fotóinkat.</p>
    <${TwoEnlargeableFigures} thumbnailFileName1="0404_varos5_200.jpg" fullSizeFileName1="0404_varos5.jpg" altText1="Város 5" thumbnailFileName2="0404_varos6_200.jpg" fullSizeFileName2="0404_varos6.jpg" altText2="Város 6" />
    <p><br />Fontos szempont a fény iránya. A déli napsütés egyrészt hűvösebb színeket eredményez, másrészt nem képez izgalmas árnyékokat. Ha lehet a napnak háttal készítsük fotóinkat, mikor az pont megvilágítja témánkat. Kerüljük az árnyékos, semmitmondó felületek fényképezését, unalmas tucatfotókkal bővül csak memóriakártyánk. Egy, a lemenő nap által megvilágított nevezetes épület részletei ilyenkor tűnnek ki igazán, ilyenkor láthatók a fény és az építészet legszebb gyümölcsei, amiket vétek lenne nem lefotózni. Szeretném felhívni a figyelmet, hogy egyes nevezetességek fotózását TILOS állvánnyal végezni, mivel egyes helyeken ez már profi fényképezésnek számít, és engedélyköteles. Sajnos az nem érdekli a helyi szerveket, hogy amatőr, utazási fotókat készítünk. Ha figyelmeztetnek minket, tegyük el az állványt és igyekezzünk megoldani a témát kézből.</p>
    <h2>Éjszaka a városban</h2>
    <p>Ha éjszaka nem szórakozni megyünk, vegyük vállunkra az állványt és induljunk fotózni. A város fényei, a forgalom, a nevezetes épületek világítása ordít a hosszúexpós fotózásért. Akinek lehetősége van rá, vigyen magával távkioldót is. Mivel úgyis hosszú exponálásokkal érjük el a kívánt hatást, ilyenkor is érdemes az érzékenységet a legalacsonyabb beállításon hagyni a képzaj csökkentése végett. Aki teheti, rekeszelje le a gépet, így még hosszabb expozíciókat készíthetünk, ami pl. a járművek mozgását teszi érdekesebbé. Ilyen esetekben a beépített éjszakai motívumprogramok nem minden esetben képesek megoldani a feladatot, így ha tehetjük, végezzük az exponálást manuálisan.</p>
    <${TwoEnlargeableFigures} thumbnailFileName1="0404_varos7_200.jpg" fullSizeFileName1="0404_varos7.jpg" altText1="Város 7" thumbnailFileName2="0404_varos8_200.jpg" fullSizeFileName2="0404_varos8.jpg" altText2="Város 8" />
    <p><br />Hogy mikor érdemes ezeket használni? Rekeszautomatikát olyan esetekben használjuk, mikor egy adott záridőre van szükségünk, és nem szeretnénk, ha gépünk automatikája mindig más záridőt állítana be, viszont a rekesz értéke számunkra közömbös. Ilyen témákból általában kevesebb adódik (pl. sportfotózás), hiszen a rekeszérték beállítása legalább olyan fontos a végeredményt tekintve, mint a záridő beállítása, és ekkor már manuális módban érdemes fényképezni. Időautomatikát már több helyzetben használhatunk. Amennyiben csupán egy adott (pl. a legtágabb) rekeszértékre van szükségünk nyugodtan rábízhatjuk gépünkre a záridő meghatározását, nekünk csak a mindenkori rekeszértéket kell belőnünk, hiszen az automatikát erre találták ki.</p>
    <p>A kivilágított épületek, hidak, szobrok fotózásakor figyeljünk a reflektorokra, amik - ha túl hosszú záridőt választunk - nagyon hamar kiéghetnek fotóinkon. Amennyiben sétáló emberek zavarnak bele képünkbe ne csüggedjünk, inkább rekeszeljük le jobban a gépet és így hosszabb záridőt használva eltüntethetjük a sétáló embereket a fotóról. Mivel kevés fénynél az autófókusz nehezen dolgozik, jobban járunk ha magunk állítjuk be az élességet is, amennyiben gépünk erre lehetőséget ad. Ha mégis autófókuszt használunk, válasszunk egyetlen fókuszpontot, kapcsoljuk ki a dinamikus élességállítást, így a gép a helyes élességet fogja beállítani.</p>
</div>`;
}