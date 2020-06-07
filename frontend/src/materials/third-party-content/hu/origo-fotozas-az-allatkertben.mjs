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
        slug: 'origo-fotozas-az-allatkertben',
        title: 'Öt tipp állatkerti fotók készítéséhez',
        author: 'Halász Dániel és Straub Ádám',
        publishDate: new Date('2008-04-26'),
        publisherName: 'Origo',
        originalUrl: 'https://www.origo.hu/techbazis/20080426-fotozas-az-allatkertben.html',
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
        <p>Digitális fényképezőgépekkel felszerelkezve mentünk el az állatkertbe, hogy megvizsgáljuk, miként lehet klassz képeket készíteni a szokatlan környezetben. A vakut felejtse el, nem árt viszont a teleobjektív vagy az ultrazoom, de még a zsebkendőjére is szükség lehet!</p>

        <h2>1. Jól jön az ultrazoom vagy a teleobjektív</h2>
        <p>Az állatkertekben többnyire kétféle módon különítik el az bentlakókat a látogatóktól: kerítés vagy üvegfal segítségével. Ezek közös jellemzője, hogy a fotózandó állatok többnyire nem közvetlen közelükben pózolva várják, hogy a hobbifotósok lencsevégre kapják őket, hanem valahol jóval beljebb futkároznak, esznek, vagy épp alszanak.</p>
        <p>Éppen ezért fotózásukhoz érdemes legalább négyszeres zoomra képes fényképezővel felszerelkezni, cserélhetős optikás masinából pedig legalább 105 milliméteres átfogású lencsével, teleobjektívvel felszerelkezni, ezekkel ugyanis már kellően közel lehet hozni egy kisebb állatot is a fotón.</p>

        <SimpleFigure fileName="20080427majom.jpg" altText="Forrás: [origo]" caption="A jobboldali fotóhoz már teleobjektív kellett"/>

        <h2>2. A vaku felejtős, állvány pótolhatja</h2>
        <p>Beltérben természetesen megfordul a helyzet, ilyenkor ugyanis csupán egy üvegfal választ el a különféle állatoktól, ilyen esetben nagylátószögű objektívet érdemes használni (kisfilmes értékeken számítva 35 milliméteresnél kisebbet). A közelségnél jóval több fejtörést okozhat viszont, hogy kevés fény van a legtöbb állatházban. Ha túl hosszú záridő kell a jó expozícióhoz, könnyen bemozdul a fényképező a kézben, ezért vagy állványra kell szerelni a fényképezőt, vagy legalább letámasztani valamihez a gépet a helyszínen.</p>
        <SimpleFigure fileName="20080427allatkert.jpg" altText="Forrás: [origo]"/>
        <p>Mivel a legtöbb állatot zavarja a vaku fénye - gondoljon bele, ön szeretné, ha egész nap villognának a szemébe? Ráadásul az üvegfal mögött lévő állatokra teljesen értelmetlen villantani, hiszen az visszaveri a fényt, így a végeredmény egy szép nagy, fehér folt lesz.</p>
        <p>Tehát a legtöbb esetben villanó nélkül kell fotózni. Az állvány ugyan segíthet, ám az izgő-mozgó állatok lencsevégre kapásával inkább magas ISO-értéket választva érdemes próbálkozni. Az, hogy milyen magas fényérzékenység érhető el, típusfüggő: kompakt fényképezők esetében általában ISO 800 felett már annyira zajos a képe a kisebb készülékeknek, hogy élvezhetetlen lesz az eredmény. Tükörreflexes masináknál jobb a helyzet, ezeknél akár ISO 1600-ig is lehet emelni az érzékenységet különösebb minőségromlás nélkül.</p>

        <h2>3. Játék a fehéregyensúllyal</h2>
        <p>Az állatkertek belső terekben gyakran mesterséges világítást alkalmaznak, melyek gyakorta nem is hagyományos izzók, hanem például a trópusi napfényt imitáló fényforrások. Ezek esetében a fényképezők automata fehéregyensúly-szabályzója sokszor nem tudja pontosan beállítani a színhőmérsékletet, így a kész fotó színei nem lesznek helyesek, a valóságoshoz hasonlóak. Ennek kiküszöbölésére már a belépőszintű gépeken is lehetőség van a gyárilag megadott értékeket (neoncső, hagyományos izzó, stb.) választani, amelyekkel jobb eredmény érhető el.</p>
        <SimpleFigure fileName="20080426allatkert3.jpg" altText="Forrás: [origo]" caption='Baloldalt automata, jobbra "zsebkendővel hangolt" fehéregyensúllyal'/>
        <p>Szerencsésebb helyzetben manuális kalibrálásra is lehetőség van, ehhez mindössze egy fehér felületet kell lefotózni a speciális lámpa fénye előtt - mi erre egy egyszerű papírzsebkendőt használtunk - mint a lenti fotón is látszik, sikerrel.</p>

        <h2>4. Polárszűrő: tükröződés, csillogás kiküszübölésére</h2>
        <p>Az üveg becsillanását a legnehezebb megakadályozni. Első szabály, hogy semmiképpen sem használjuk a beépített vakut a fényképezőn, mert az garantáltan vissza fog tükröződni. Ehelyett érdemes beruházni a kifejezetten digitális típusokhoz tervezett, úgynevezett cirkuláris polárszűrőre. Az ilyen kiegészítőket már 3-4 ezer forintért meg lehet kapni a hazai boltokban, bár számos kompakt gépen nincs szűrőmenet, ezért nem lehet felszerelni rájuk, ami megakadályozza használatát.</p>
        <SimpleFigure fileName="20080427allatkert1.jpg" altText="Forrás: [origo]" caption="Üvegen át is készíthet jó képet - a cirkuláris polárszűrő segíthet"/>
        <p>A cserélhető optikás fotógépeknél ilyen gond természetesen nincs, és a polárszűrő forgatásával a csillogás, tükröződés egy része eltüntethető az üvegfelületről, így jobban átlátszik az üveg mögötti látvány. Bár nem érdemes csodára számítani (bizonyos üvegtípusok esetében ez a szűrő sem segít), de sok esetben megkönnyítheti a szép fotók készítését a polárszűrő.</p>

        <h2>5. Nézze meg a programfüzetet!</h2>
        <p>Bár az állatkerti állatok életritmusa jócskán eltér vadon élő társaikétól, ez nem jelenti azt, hogy a reggeli nyitástól a délutáni zárásig produkálni is fogják magukat a látogatók előtt. Noha bizonyára egy alvó oroszlánról is készülhet ötletes fotó, például egy zugába visszahúzódott pingvinről még a legjobb állatfotós sem képes izgalmas képet exponálni. Az állatokat valamilyen aktivitás közben érdemes lefotózni, például etetés, vagy bemutató közben. A legtöbb park tájékoztatófüzetében ezekről a programokról könnyen találni tájékoztatást, a <ExternalLink href="http://www.zoo-budapest.com/info/legy_ott/index.php">fővárosi állatkert honlapjáról például letölthető</ExternalLink> egy ilyen katalógus.
        </p>
    </>;
}