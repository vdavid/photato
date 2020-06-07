import React from '../../../web_modules/react.js';
import SimpleFigure from '../../components/SimpleFigure.mjs';
import EnlargeableFigure from '../../components/EnlargeableFigure.mjs';
import ExternalLink from '../../components/ExternalLink.mjs';

// noinspection JSUnusedGlobalSymbols (This file is loaded dynamically.)
/**
 * @returns {ArticleMetadata}
 */
export function getMetadata() {
    // noinspection SpellCheckingInspection (It's in Hungarian.)
    return {
        slug: 'fotobetyar-objektivek-jellemzoi-gyujtotavolsag',
        title: 'A gyújtótávolság egyszerűen, érthetően',
        author: 'fotobetyar.hu',
        publishDate: new Date('2020-01-01'),
        publisherName: 'Fotóbetyár',
        originalUrl: 'https://www.fotobetyar.hu/interaktivanyagok/objektivek-jellemzoi-gyujtotavolsag/',
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
        <h2>A gyújtótávolság egyszerűen és érthetően, kiegészítve a fényerővel és egyéb fotó objektívekkel kapcsolatos alapfogalmakkal, kulcsszavakkal</h2>
        <p>A képkészítéshez nélkülözhetetlen objektíveknek számtalan fontos tulajdonsága van: <strong>gyújtótávolság, fényerő, rajzolat,</strong> amelyekell jobb baráti viszonyt ápolni.
        </p>
        <p>Jól jön ez a tudás használat közben -tehát fotózáskor, objektívek vásárlásakor, valamint a fényképészek egymás közötti kommunikációjában. Alábbi anyag összefoglalja neked a legfontosabb tényezőket, amelyeket muszáj ismerned.</p>

        <h2>1. Gyújtótávolság</h2>
        <p>Az objektívek első és egyik legfontosabb tulajdonsága az objektív <strong>Gyújtótávolsága</strong>. Ez egy érdekes mérőszám, amivel tulajdonképpen az objektívek <strong>látószögét</strong> jellemezzük. A két szám <strong>fordítottan arányos</strong> egymással, tehát <strong>minél magasabb a gyújtótávolság annál kisebb a látószög</strong>. Lásd alábbi info grafikánkat:
        </p>
        <SimpleFigure fileName="latoszog-gyujtotav_qpng_opt.png" altText="Gyújtótávolság"/>
        <p>
            <strong>…“oké, de mi ez a gyújtótávolság?!” </strong>kérdezheted jogosan
        </p>
        <p>
            <strong>A hivatalos elmélet és magyarázat:</strong>
        </p>
        <p>Egy objektív mindig több lencsetagból áll, vannak egyszerűbb és összetettebb lencsék, lencserendszerek.</p>
        <SimpleFigure fileName="gytavhoz1.jpg" altText="Lencse keresztmetszet"/>
        <p>Viszont optikai szempontból mindig lehet <strong>egy üvegtaggal/lencsével helyettesíteni</strong> egy összetett rendszert is (lásd alábbi ábra).
        </p>
        <p>Ha ezt megtesszük és<strong> lemérjük a távolságot</strong>, hogy a párhuzamosan érkező sugarakat (alábbi ábra bal oldala) a lencsétől hány miliméter távolságban gyűjti össze egy pontban akkor megkapjuk a <strong>gyújtótávolságot</strong>.
        </p>
        <SimpleFigure fileName="gytav2.jpg" altText="Sugarak"/>
        <p>Nagyon kérünk ne kérdezd, hogy <strong>miért nem látószögben mérjük/mondjuk</strong> ezt az értéket… ez terjedt el, ezt használja mindenki, ez a divat, mint vadnyugaton a pisztoly meg a pantalló.
        </p>
        <p>Elég ritkán fogalmazunk úgy, hogy vettem egy 46 fokos látószögű objektívet, viszont a “<strong>vettem egy 50-es alapobjektívet</strong>” teljesen hétköznapi kijelentés (mindig hétköznap veszünk alapobjektívet ;-).
        </p>
        <p>Még pálinkánál is többször mondjuk a fokot, mint az objektívnél 🙂 &gt;&gt; Persze hozzávetőlegesen illik ismerni ezt az értéket is. (… mármint a pálinkáét… ha sokat iszol a “rossz” hőfokúból, olyan látószöged lesz hogy ihaj 😉</p>

        <h2>2. Objektívek fajtái, típusai</h2>
        <p>Bizonyára már hallottál róla, hogy több féle objektív is létezik, ezeket sokszor gyújtótávolság alapján, de néha más tényezők mentés különböztetjük meg vagy csoportosítjuk!</p>
        <p>Alább egy felsorolás a különböző fajtákból, típusokból &gt;&gt;</p>
        <p>
            <strong>Létezik belőle: </strong>
        </p>
        <ul>
            <li>Fix</li>
            <li>Zoom</li>
            <li>Makró</li>
            <li>Nagylátószögű &gt;&gt; ejtsd:”Nagylátó”</li>
            <li>Halszem</li>
            <li>Teleobjektív &gt;&gt; ejtsd: “Tele”</li>
            <li>Normál/Alap objektív</li>
            <li>Tükörobjektív</li>
        </ul>
        <EnlargeableFigure fileName="canon-ef-lenses.jpg" altText="Objektívek" caption="Nagyon sokféle objektív létezik – A kép kattintással nagyítható"/>
        <p>
            <strong>Nézzünk pár tipikus gyújtótávolságot</strong> és hogy mikor használjuk. Figyelem az esztétikában az a szabály, hogy nincs szabály. Mindent lehet és annak az ellenkezőjét is. Allábiakat ne egzakt törvényként kezeljétek!!
        </p>

        <h2>Nagylátószögű objektívek</h2>
        <p>Tájképek, épületek, épületbelsők fotózásához. Jellemzője: nagy látószög, nagy mélységélesség, a térélményt szépen visszaadja.</p>
        <p>
            <strong>Jellemző gyújtótávolságuk: 16-24-35mm</strong>
        </p>
        <EnlargeableFigure fileName="Nikon_Super_Wide_Angle.jpg" altText="Nikon Super Wide Angle"/>
        <p>Nézd csak meg alábbi képeket, szépen látható és elkülönül az előtér, középtér, háttér!</p>
        <div className="figures">
            <EnlargeableFigure fileName="Objektivek_015_2.jpg" thumbnailFileName="Objektivek_015_2-400x284.jpg" altText="Objektívek"/>
            <EnlargeableFigure fileName="gyutav_estadt.jpg" thumbnailFileName="gyutav_estadt-400x284.jpg" altText="Objektívek"/>
            <EnlargeableFigure fileName="Objektivek_010.jpg" thumbnailFileName="Objektivek_010-400x284.jpg" altText="Objektívek"/>
            <EnlargeableFigure fileName="Objektivek_011.jpg" thumbnailFileName="Objektivek_011-400x284.jpg" altText="Objektívek"/>
            <EnlargeableFigure fileName="Objektivek_013.jpg" thumbnailFileName="Objektivek_013-400x284.jpg" altText="Objektívek"/>
        </div>

        <h2>Az “Alapobjektív”</h2>
        <p>Az alapobjektív gyújtótávolsága 50mm – Itt kezdődnek nagyjából a portré optikák és nagyjából a 100mm-es úgynevezett “portré-teléig” tartanak</p>
        <div className="figures">
            <EnlargeableFigure fileName="Objektivek_021.jpg" altText="Objektív"/>
            <EnlargeableFigure fileName="IMG_6066_2.jpg" altText="Illusztráció"/>
            <EnlargeableFigure fileName="Objektivek_026.jpg" altText="Illusztráció"/>
        </div>
        <p>Két gyújtótávolság összehasonlítása arc fotózása esetén – Figyeljük meg a bal oldali nagylátó mennyire torz képet “fest” a hölgyről és milyen sok felesleges képelem jelenik meg a lány mellett (a képek nagyíthatóak)</p>

        <SimpleFigure fileName="Objektivek_028.jpg" altText="16mm vs 200mm"/>

        <h2>Teleobjektív</h2>
        <p>50mm felett már teleobjektívnek hívjuk a lencséket – Ha nem tudod megközelíteni a témát – Sokszor állatfotózásra használjuk – Síkba “paszírozza” a látványt. Kis látószög és kicsi/sekély mélységélesség jellemzi őket</p>
        <SimpleFigure fileName="Objektivek_030.jpg" altText="Illusztráció"/>
        <SimpleFigure fileName="Objektivek_033.jpg" altText="Baglyok" caption="Máté Bence felvétele"/>

        <h2>3. Az Objektívek fényereje</h2>
        <p>Ez nagyjából a <strong>második legfontosabb tulajdonsága</strong> az optikának. <strong>Minél fényerősebb az optika, annál több fényt képes összegyűjteni</strong> (és annál többe kerül). A fényerőt a legtágabb blende értékkel mérjük/jellemezzük és <strong>minél kisebb ez a szám, annál jobb az eszköz fényereyeee</strong>. Pl.: Egy 1,4-es fényerejű objektív jobb/fényerősebb, mint egy 4-es fényerejű.
        </p>
        <p>Amúgy a fényerő egy <strong>arányszámot jelöl</strong> és azt mutatja, hogy hogyan aránylik a gyújtótávolság az átmérőhöz. Pl: Egy 1-es fényerejű optikához ha 50mm-es a gyújtótávolsága akkor 50mm-es átmérőre van szűkség. <strong>Fényerő= Gyújtótáv/(osztva)Átmérő.</strong> Másik példa: 200mm-es teleobjektívnek 2-es a fényereje, ha 100mm az átmérője &gt;&gt; 200/100=2. Lásd alábbi képen is.
        </p>
        <SimpleFigure fileName="200mm-opt.jpg" altText="Canon objektív"/>
        <p>
            <strong>Fényerős optika előnyei:</strong>
        </p>
        <ul>
            <li>Fényszegény körülmények között, <strong>alacsonyabb ISO és/vagy rövidebb záridőt</strong> tudsz beállítani. Így <strong>nem lesz annyira zajos</strong> a kép és/vagy <strong>nem mozdul be</strong> a felvétel
            </li>
            <li>A blende hatással van a mélységélességre (Mélységélesség anyaghoz <ExternalLink href="http://www.fotobetyar.hu/interaktivanyagok/melysegelesseg/" title="Mélységélesség">kattints ide</ExternalLink>), fényerős optikának tágabb a blendéje &gt;&gt; kisebb a mélységélessége, <strong>szebben tudsz kiemelni</strong>
            </li>
            <li>
                <strong>Vakuzásnál</strong>, világításnál<strong> kisebb villanás</strong>, fényerő szükséges
            </li>
        </ul>
        <p>A jó minőségű optikai üveg alapanyaga nagyon drága. <strong>A nagy fényerőhöz, nagy átmérő &gt;&gt; sok üveg</strong> szükségeltetik. Ezért a jó minőségű optika, ami nagy fényerejű igen borsos árcetlivel érkezik. Ha érdekel ez kis összefüggés, egy erről szóló cikkünket ajánljuk figyelmedbe. Eléréséhez csak <ExternalLink href="http://www.fotobetyar.hu/az-objektivek-genetikaja/">kattints ide</ExternalLink> &gt;&gt;
        </p>
    </>;
}