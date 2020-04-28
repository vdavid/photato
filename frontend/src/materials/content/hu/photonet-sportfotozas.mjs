import React from '../../../web_modules/react.js';
import SimpleFigure from '../../components/SimpleFigure.mjs';

// noinspection JSUnusedGlobalSymbols (This file is loaded dynamically.)
/**
 * @returns {ArticleMetadata}
 */
export function getMetadata() {
    // noinspection SpellCheckingInspection (It's in Hungarian.)
    return {
        slug: 'photonet-sportfotozas',
        title: 'Sportfotózás',
        author: 'PhotoNet',
        publishDate: new Date('2010-07-29'),
        publisherName: 'PhotoNet Magazin',
        originalUrl: 'http://www.photonet.hu/arhiv/sportfotozas.html',
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
        <p>A sportesemények tele vannak emlékezetes pillanatokkal, legyen az a gyermekünk iskolai sport rendezvénye, vagy profi sportesemény. Ugyanakkor a gyors mozgások megörökítése kihívást is jelent a megörökítése szempontjából. Mire figyeljünk oda, amikor a fényképezés tárgya egy mozgó személy, vagy tárgy.</p>
        <SimpleFigure fileName="forma1.jpg" altText="Forma 1"/>

        <h2>Rekeszidő</h2>
        <p>Az egyik leglényegesebb szempont az expozíció sebessége, amikor mozgást szeretnénk megörökíteni. Amennyiben lehetöségünk van a rekeszidö kiválasztására, válasszunk 1/125 másodpercnél gyorsabb idöt. 1/250, vagy gyorsabb, még jobb. A nagyon gyors mozgású sportok, mint az autóversenyek, repülö bemutatók még ennél is gyorsabb beállítást igényelnek. Amennyiben fényképezögépünk nem rendelkezik rekeszidö beállítási lehetöséggel válasszunk idö automatikát, sport program módot. A kompakt fényképezögépek nem igazán alkalmasak sportfotózásra. Ilyen fényképezögéppel próbáljunk meg minél közelebb kerülni az eseményekhez, hogy ne kelljen zoomot igénybe vegyünk, ami még inkább levesz az expozíció sebességéböl.</p>

        <h2>Használjunk zoom objektívet</h2>
        <p>A legtöbb sporteseménynél nem lehet elég közel menni az akciókhoz. Egy amatör, baráti foci mérközésen a pálya széléröl is tudunk fotózni, míg egy Forma 1-es futamon csak tisztes távolból. Mindenképpen tanácsos minél erösebb és jobb fényerejü tele/zoom objektívvel készülni a fotózásra, hogy a tárgy kitöltse a képet. A sportrendezvénytöl függöen a 100 - 500 mm közötti objektívek a legalkalmasabbak a megfelelö képkivágásra. Amennyiben digitális fényképezögéppel fotózunk, tartózkodjunk a digitális zoom használatától, mert rontja a kép felbontását és rosszabb nyomat készíthetö ezekröl a képekröl. A legnagyobb felbontást választva ezeken a gépeken jobb eredményt érhetünk el, ha a képet utólag a photoshop programban kroppoljuk.</p>
        <SimpleFigure fileName="kerekpar.jpg" altText="Kerékpár"/>

        <h2>Panning</h2>
        <p>Egy erösebb mozgás effektust érhetünk el, ha fényképezögépünkkel követjük az eseményeket, a mozgást (panning). Ez a technika sok gyakorlást igényel, hogy megfelelö eredményt kapjunk, de a képek nagyon izgalmasak lesznek. Figyelnünk kell arra, hogy a mozgás a film síkjával párhuzamosan történjen, hogy a fókusztávolság ne változzon. Válasszunk egy viszonylag lassú rekeszidöt, a mozgás sebességétöl függöen és a fókusztávolságot állítsuk be elöre, nagyjából arra a pontra, ahová a fotó tárgyát várjuk. Amikor a tárgy az adott pontra ér kezdjük el követni a kamerával, miközben exponálunk. Figyeljünk arra, hogy a mozgásunk egyforma legyen a tárggyal, a kamera ne rázkódjon és egy szintben maradjon. Azoknál a digitális kameráknál, ahol nincs mód manuálisan fókuszt állítani, mérjünk fényt és állítsunk fókuszt egy adott pontra, ahova a tárgyat várjuk. Ha lehetöség van rá megkérhetjük ismerösünket, hogy álljon az adott pontra, vagy ha ez nem lehetséges, akkor keressünk egy nagyjából függöleges vonalat azon a környéken és arra fókuszáljunk. Tartsuk az exponáló gombot ebben az állapotban félig lenyomva, míg a tárgyunk az adott pontra érkezik és exponáljunk, miközben a kamerával követjük a mozgást. A digitális kameráknál az eredményt azonnal visszanézhetjük, és tovább gyakorolhatunk, amíg megfelelö képet nem kapunk.</p>
        <SimpleFigure fileName="basketball.jpg" altText="Kosárlabda"/>

        <h2>Készítsünk képeket a sportolókról</h2>
        <p>Ha lehetöségünk adódik az események elött, vagy után készítsünk csapat és egyéni képeket, melyen a sportolókat és résztvevöket örökítjük meg. Mindig érdekes téma az adott rendezvényen résztvevök megörökítése. A tévében, vagy a lelátón ülve az arcok nehezen kivehetök, az arckifejezéseket és érzéseket nehezebb visszaadni. Ezt próbáljuk meg megörökíteni, legyen szó profi sportolóról, vagy a lányunk úszóversenyéröl. A rendezvény végén próbáljunk meg közelebb kerülni a résztvevökhöz. Amennyiben elég közel tudunk jutni, ajánlott a vaku használata külsö és belsö fotózásnál egyaránt. A külsö fotózásnál ahhoz, hogy az arcot derítsük és a nap, vagy más (pl. baseball sapka) okozta árnyékok csökkentésére.</p>

        <h2>Alkalmazkodás teremsportokhoz</h2>
        <p>A teremsportok egészen másfajta körülményeket teremtenek, ahol a világítás nem mindig kedvez a fotózáshoz. Figyeljünk arra, hogy a játékos fókuszban legyen, és amennyire lehet az objektív közepén, a kis mélységélesség miatt. Amennyiben lehet vakut használni (ellenörizzük a rendezökkel) figyeljünk a vakunk hatótávolságára. Azt is ellenörizzük, hogy a használni kívánt objektív tartományával kompatibilis-e vele. Ezeket az adatokat megtaláljuk a vaku leírásában.</p>
        <SimpleFigure fileName="surf.jpg" altText="Szörf"/>

        <h2>Biztonság</h2>
        <p>Mindig tartsuk be a rendezöség utasításait! Ha nincs rendezöség, kövessük az ésszerüség szabályait. A fényképezéssel ne zavarjuk a résztvevöket, ez különösen vonatkozik a vaku használatára. Technikai sportoknál ügyeljünk arra, hogy biztonságos távolságot tartsunk a pálya szélén.</p>
        <p>Egy jó képért, az adott pillanatban, nem éri meg kockáztatni a többi jó képet a jövöben.</p>
        <p>Jó sport- és akciófotózást kívánunk!</p>
    </>;
}