import {createElement} from '../../../web_modules/react.js';
import htm from '../../../web_modules/htm.js';
import SimpleFigure from '../../components/SimpleFigure.mjs';
import YouTubeVideo from '../../components/YouTubeVideo.mjs';
const html = htm.bind(createElement);

// noinspection JSUnusedGlobalSymbols (This file is loaded dynamically.)
/**
 * @returns {ArticleMetadata}
 */
export function getMetadata() {
    // noinspection SpellCheckingInspection (It's in Hungarian.)
    return {
        slug: 'canon-az-expozicio-beallitasa',
        title: 'Az expozíció beállítása',
        author: 'Canon',
        publishDate: new Date('2019-06-18'),
        publisherName: 'Canon.hu',
        originalUrl: 'https://www.canon.hu/get-inspired/tips-and-techniques/how-to-control-exposure/',
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
    <p>Az expozíció a fényképezőgép érzékelőjébe jutó fény mennyiségének mércéje, ez határozza meg, mennyire tűnik világosnak vagy sötétnek a kép. A záridővel, a rekeszértékkel és az ISO-val lehet szabályozni. Ezeknek a beállításoknak a módosítása nem csak az expozícióra van hatással, hanem a fényképed megjelenésére is.</p>
    <p>A fényképezőgéped általában az expozícióval kapcsolatos összes igényedet ki tudja elégíteni az Automatikus módok használatával. Ugyanakkor ha megtanulod, hogyan befolyásolják a különféle tényezők a fényképeidet, akkor magabiztosan veheted a kezedbe az irányítást. Ezután képeid biztosan ki fognak tűnni a többi közül.</p>
    <p>Ez a videó magyarázza el, hogyan kell a rekeszérték, a záridő és az ISO beállításait használni a fényképednek megfelelő expozíció és hatás eléréséhez.</p>
    
    <${YouTubeVideo} width="560" height="315" src="https://www.youtube.com/embed/_10AbMujRJU" />
    
    <h2>Rekesz</h2>
    
    <p>A rekeszérték az objektívben lévő lyuk méretére utal, amelyen keresztül áthalad a fény. Minden egyes objektívnek számos rekeszbeállítása van a nagytól a kicsiig. Használd a Rekesz-előválasztás módot (Av) a rekeszérték beállítására, miközben továbbra is hagyod, hogy a fényképezőgép gondoskodjon a teljes expozícióról.</p>
    <p>A rekesznyílás méretét az f-érték jelöli. A nagy rekesznyílást kis számok jelölik, mint például f/2,8. Ezek több fényt engednek be, és kis mélységélességet hoznak létre (nagyobb az elmosódottság a fókuszpontodon túl). A kis rekesznyílásra nagy számok utalnak, mint például f/16. Ezek kevesebb fényt engednek be, és nagyobb területet tartanak fókuszban az előtértől a háttérig.</p>

    <${SimpleFigure} fileName="canon-get-inspired-exposure-optiona-2-1920x1080-textwhite.jpg" altText="Illusztráció" />
    
    <p>Ennek a két felvételnek hasonló az expozíciója, de a rekeszérték eltérő. Vedd észre, hogy a bal oldalon lévő kép esetében a kis rekesznyílás nagyobb mélységélességet teremt, és sok terület van fókuszban. A jobb oldali kép esetében a rekesznyílás növelése csökkenti a mélységélességet, ezért sokkal kevesebb dolog van fókuszban.</p>
    
    <h2>Záridő</h2>
    <p>A záridő az az idő, ameddig fény érheti az érzékelőt. Másodpercekben fejezzük ki. Használd a Záridő-előválasztás módot (Tv) a záridő beállítására, miközben továbbra is hagyod, hogy a fényképezőgép gondoskodjon a teljes expozícióról.</p>
    <p>A rövid záridők, például az 1/1000 mp a gyors cselekmények kimerevítésére használatosak (mint a folyó víz mozgása). A hosszú záridő további mozgás hozzáadására, például a patakban folyó víz elmosódottá tételére való.</p>

    <${SimpleFigure} fileName="canon-get-inspired-exposure-optiona-3-1920x1080-textwhite.jpg" altText="Illusztráció" />

    <p>Hasonlítsd össze ezt a nagyon hasonló expozícióval, de eltérő záridővel készített két képet. Figyeld meg, milyen hatással van a hosszú záridő a mozgásban lévő vízre. Hosszú expozíciókhoz állványt vagy támasztékot kell használnod, hogy kivédd a fényképezőgép bemozdulását.</p>
    <h2>ISO</h2>
    <p>Az ISO állítja be az érzékelő fényérzékenységét. Ezért használható az érzékelőre eső fény felerősítésére, ami nagyobb rugalmasságot tesz lehetővé a záridő és a rekeszérték tekintetében. Az ISO általában 100-as értékkel kezdődik, és az érzékenység fokozódásával emelkedik a száma.</p>
    <p>Az ISO képes rontani is a képminőséget, ami szemcsés, zajos képekben vagy tompa színekben nyilvánul meg. Ha lehetséges, általában az alacsonyabb ISO-beállítást a legjobb használni.</p>

    <${SimpleFigure} fileName="canon-get-inspired-exposure-optiona-4-1920x1080-textwhite.jpg" altText="Illusztráció" />
    
    <p>A jobb oldali jelenet jóval sötétebb, mint a bal oldali. Ahhoz, hogy állvány használata nélkül tudj fényképezni, megfelelően rövid záridőt kell fenntartani. A kompenzálás miatt ehhez növelned kell az ISO értékét. Ebben az esetben 1250-re, ami nem befolyásolta túlságosan a képminőséget.</p>
    <p>Az expozíció beállítása az ezen három beállítás közötti egyensúlyozást jelenti. Például a záridő csökkentése egy gyors cselekmény kimerevítése érdekében alulexponálttá teheti a képedet. Az ellensúlyozáshoz nagyobb rekesznyílás szükséges. Ehhez hasonló módon az előtér és a háttér élességének maximalizálását célzó kisebb rekesznyílás miatt növelni kell a záridőt. Az expozíció megtartásához az ISO-t is használhatod. Ezt a kapcsolatot gyakran láthatod expozíciós háromszögként ábrázolva.</p>
    <p>Az expozíciókompenzációs tárcsa lehetővé teszi a kép világosabbá vagy sötétebbé tételét. A mínusz szám csökkenti az expozíciót, és sötétebbé teszi a képet, a pozitív szám pedig növeli az expozíciót, hogy világosítsa a képet.</p>

    <${SimpleFigure} fileName="canon-get-inspired-exposure-optiona-5-800x534-textwhite.jpg" altText="Illusztráció" width="800px" />
    
    <p>Ennél a két felvételnél egyértelműen eltérő az expozíció, holott ugyanannyi fény jellemzi a két jelenetet. A bal oldalon lévő felvétel túl sötét vagy alulexponált, a jobb oldali pedig túl világos vagy túlexponált. Az expozíciókompenzáció használata korrigálná az expozíciót.</p>
    <p>Az expozíció ekképpen történő beállításával kreatív hatást lehet elérni. Tedd sötétebbé a képeidet, hogy erőteljesebbé tehesd a hangulatot és mélyíthesd a színeket, ami különösen tájképek esetében jön jól. Ha növeled az expozíciót, akkor világosabbak lesznek az árnyékok, és modernebb hatást érhetsz el.</p>
    <p>Az expozíciósorozat lehetővé teszi, hogy többféle expozícióval rögzíts egy jelenetet, majd később kiválaszd a legjobbat. Válassz az expozíciós skála 1–3 fokozata között, és hagyd, hogy a fényképezőgép elvégezze a beállításaidnak megfelelő szükséges módosításokat.</p>
    <p>Amikor legközelebb útnak indulsz a fényképezőgépeddel, próbálj meg kísérletezni a különféle beállításokkal, és tapasztald meg, milyen változásokat hoznak létre a fényképeken.</p>
</div>`;
}