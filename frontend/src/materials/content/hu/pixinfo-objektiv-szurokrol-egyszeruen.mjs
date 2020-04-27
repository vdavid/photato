import {createElement} from '../../../web_modules/react.js';
import htm from '../../../web_modules/htm.js';
import TwoEnlargeableFigures from '../../components/TwoEnlargeableFigures.mjs';
import EnlargeableFigure from '../../components/EnlargeableFigure.mjs';
import ImageComparisonWithSlider from '../../components/ImageComparisonWithSlider.mjs';
import ExternalLink from '../../components/ExternalLink.mjs';
const html = htm.bind(createElement);

// noinspection JSUnusedGlobalSymbols (This file is loaded dynamically.)
/**
 * @returns {ArticleMetadata}
 */
export function getMetadata() {
    // noinspection SpellCheckingInspection (It's in Hungarian.)
    return {
        slug: 'pixinfo-objektiv-szurokrol-egyszeruen',
        title: 'Objektív szűrőkről – egyszerűen',
        author: 'Irházy Róbert (Birdie)',
        publishDate: new Date('2014-02-24'),
        publisherName: 'Pixinfo.hu',
        originalUrl: 'https://pixinfo.com/cikkek/objektiv-szurokrol-egyszeruen/',
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
    <h2>A szűrők feladata</h2>
    <p>Fotózás során szűrőket azért használhatunk, hogy megváltoztassuk a fényképezőgépünkbe jutó fény tulajdonságát. Ez lehet a fény mennyiségének csökkentése, lehet az irányultságának (polarizáltságának) befolyásolása, de lehet a szín módosítása is. Ezen felül különböző effekt szűrőkkel feldobhatjuk fotóink hangulatát. A fő cél tehát a kép módosítása.</p>
    <h2>A legegyszerűbb szűrő: az UV szűrő</h2>
    <p>Manapság leginkább az objektív frontlencséjének védelmére szokás használni, hiszen a fotózások javarészénél rajta hagyhatjuk az objektív előtt. Mivel a fény 99,9%-át átengedi, nem befolyásolja a fotózás technikai részét, vagyis ugyanolyan zársebességgel fotózhatunk, mint nélküle. Az UV szűrőket alapvetően az ultraibolya fény kiszűrésére találták ki, ilyennel főként nagy magasságokban, hegyekben találkozhat a gépünk. Ilyen esetben az UV szűrő csökkenti a távoli témák kék elszíneződését, amelyet az ultraibolya fény okoz.</p>
    <${TwoEnlargeableFigures} thumbnailFileName1="B_plus_W_Premium_UV_filter_240d.jpg" fileName1="B_plus_W_Premium_UV_filter_800d.jpg" altText1="B plus W Premium UV filter" thumbnailFileName2="Phottix_UV_onlens_240d.jpg" fileName2="Phottix_UV_onlens_800d.jpg" altText2="Phottix UV onlens" />
    <p>Az egyes gyártók egyébként hajlamosak túllihegni az UV szűrő fontosságát és jelentős kontrasztkülönbségű képekkel ábrázolják, hogy mennyire jó is az UV hatása a képre. A valóságban azonban normál körülmények között semmi észrevehető előnyt nem ad az UV-szűrő.</p>
    <p>UV szűrőket pár ezer Ft-ért vásárolhatunk, amely a tapasztalatlanabb fotósoknak jó befektetésnek bizonyulhat, hiszen inkább egy olcsó UV szűrő törjön/karcolódjon, mint egy drága objektív frontlencséje. Tapasztaltabb fotósok azonban megvannak e szűrő nélkül is, persze ilyenkor jobban kell vigyázni a felszerelésre is.</p>
    <${EnlargeableFigure} thumbnailFileName="UV_filter_protect_500a.jpg" fileName="UV_filter_protect_oa.jpg" altText="UV filter protect 500a" caption="UV filter protect 500a – Forrás: Wikipedia" />
    <p>UV szűrőt egyetlen esetben nem javaslunk fent tartani az objektív előtt: esti/éjszakai fotózásnál. Ilyenkor ugyanis jelentősen megnő az esélye a tükröződések, szellemképek kialakulásának. Vásárláskor ezért érdemes olyat választani, amely több rétegű kialakítású (HMC, MRC).</p>
    <${ImageComparisonWithSlider} fileName1="01_uv_wolens_400a.jpg" fileName2="02_uv_phottix_400a.jpg" width="400px" caption="Canon EF 50mm f/1.8 szűrő nélkül és Phottix ultrasim UV szűrővel" />
    <${ImageComparisonWithSlider} fileName1="01_uv_wolens_400a.jpg" fileName2="03_uv_hoya_400a.jpg" width="400px" caption="Canon EF 50mm f/1.8 szűrő nélkül és Hoya UV szűrővel" />
    <h2>A polarizációs szűrő</h2>
    <${EnlargeableFigure} thumbnailFileName="B_plus_W_Professional_circular_polariser_filter_240d.jpg" fileName="B_plus_W_Professional_circular_polariser_filter_800d.jpg" altText="B plus W Professional circular polariser filter" />
    <p>Az UV szűrő után a legsűrűbben alkalmazott szűrő, amelynek már komoly hatásai is vannak a képre nézve. A középiskolában tanítják a fény tulajdonságai között a polarizáltságot is, amely a fény hullám tulajdonsága miatt következik be. A Napból érkező fény polarizálatlan, azaz körkörös rezgésű, azonban a legtöbb felületről visszaverődve a visszavert fény már csak egy irányú rezgéssel rendelkezik, azaz polarizált. Az ilyen fények kiszűrésére való a polárszűrő.</p>
    <p>A gyakorlatban a legtöbbször az égbolt kékjének erősítésére használjuk, a hatás a Nap irányával merőlegesen a legerősebb, azaz pl. delelő Napnál szinte hatástalan, míg kora délelőtti, vagy késő délutáni órákban igen erős jelentőséggel bír.</p>
    <${EnlargeableFigure} thumbnailFileName="Polariser_sample_500a.jpg" fileName="Polariser_sample_oa.jpg" altText="Boldstar" caption="Bal: szűrő nélkül, Jobb: polarizációs szűrővel. Fotó: Boldstar" />
    <p>Polarizált fény nem csak a légkörben található vízcseppekről érkezhet a gépünkbe (lásd égbolt), hanem a levelekről, autók karosszériájáról és üvegfelületekről is visszaverődhet, utóbbiak esetében akkor tudjuk a tükröződést kiszűrni, ha a visszaverődési szög kb. 30 fok.</p>
    <${EnlargeableFigure} thumbnailFileName="Polariser_sample_2_500a.jpg" fileName="Polariser_sample_2_oa.jpg" altText="Aidan Wojtas" caption="Bal: szűrő nélkül, Jobb: polarizációs szűrővel. Fotó: Aidan Wojtas" />
    <p>A polárszűrő használatakor a szűrőt magunknak kell beforgatni a megfelelő irányba, ehhez jó segítséget nyújtanak a tükörreflexes gépek TTL (objektíven keresztüli) keresői. Ha az égbolt sötétítése a cél, akkor érdemes már a szűrő beforgatása előtt rögzíteni a fénymérést, mivel a csökkentett bejutó fénymennyiség miatt (lásd égbolt sötétedése) a gép hajlamos lesz túlexponálni.</p>
    <p>Jó, ha tudjuk, hogy a polarizációs szűrők általában csak a fény felét engedik át magukon, szakmai nyelven fogalmazva 1 Fé-et vesznek le. Ez azt jelenti, hogy ha szűrő nélkül még éppen képesek vagyunk berázás nélkül fotózni, akkor szűrőt használva ezt csak úgy tehetjük meg, ha duplájára emeljük az érzékenységet. Szerencsére napsütéses időben ilyen probléma csak igen ritkán adódhat. Mivel a szűrő csökkenti a gépbe jutó fény mennyiségét, csak akkor hagyjuk a gépünk objektíve előtt, ha szűkségünk van a hatására.</p>
    <p>Polárszűrőből alapvetően két fajta létezik, a lineáris és a körpolarizációs. A gyártók digitális géphez (főként tükörreflexeshez) a körpolarizációs szűrőt ajánlják, mivel az nem veszik össze a fókuszrendszer segédtükrével. A gyakorlati tapasztalat azonban azt mutatja, hogy a lineáris polárszűrők is tökéletesen és problémamentesen használhatók, ezek ára ráadásul alacsonyabb, mint a körpolarizációs szűrőké.</p>
    
    <h2>Az ND szűrő</h2>
    <${EnlargeableFigure} thumbnailFileName="B_plus_W_Professional_ND_filter_240d.jpg" fileName="B_plus_W_Professional_ND_filter_800d.jpg" altText="ND szűrő" />
    <p>Tájkép fotósok körében igen népszerű az ND, azaz természetes szürke szűrő, amelynek célja, hogy jelentősen csökkentsük a gépbe jutó fény mennyiségét. Erre alapvetően az objektívbe épített rekesz is használható, de csak korlátozott mértékben. Egy átlagos objektívnél rekeszeléssel 1/32-ed-1/64-ed részére csökkenthetjük a bejutó fény mennyiségét, de F11-nél szűkebb rekesz használatakor már csökken a képünk részletgazdagsága, élessége is. ND szűrővel viszont akár ezredére is csökkenthető a fényerő, ráadásul a kép részletességének csökkenése nélkül.</p>
    <p>ND szűrővel tehát napos időben is készíthetünk igen hosszú expozíciós idejű felvételeket, amelyek jótékony hatásúak a mozgó vízfelület vagy vízesés képen való megjelenésére, illetve arra is alkalmas, hogy lassan mozgó sötét tárgyakat „eltüntessünk” a képről.</p>
    <p>Ezen szűrők között találunk olyanokat is, amelyek variálható fényáteresztő képességűek. Itt azért tudnunk kell, hogy ezek fényerő gyengítő hatása általában 200-300×-os érték környékén már megáll, azaz nem a legerősebb ND szűrők, valamint azt, hogy a variálhatósága miatt egy ponton túl már nem lesz homogén, a képsarkok más erősségben szűrődnek, mint a képek középső része.</p>
    <${ImageComparisonWithSlider} fileName1="50mm_nofilter_400a.jpg" fileName2="50mm_phottixvnd3_400a.jpg" width="400px" caption="Bal: 1/320 mp, szűrő nélkül; Jobb: 2,5 mp, variálható ND-vel" />
    <${EnlargeableFigure} fileName="fotozz_230942.jpg" altText="Középfölde" caption="Fotó: Solymosi Réka (Nanuq)" />
    
    <h2>Effekt szűrők</h2>
    <p>Különleges szűrőket sorolhatunk az effekt szűrők kategóriába, ahol az objektívre feltekerhető szűrőkön kívül meg kell említenünk a <${ExternalLink} href="https://pixinfo.com/cikkek/cokin_filter">lapszűrőket</a> is. Az effekt szűrők között átmenetes szürke, vagy átmenetes színes szűrőket találhatunk, amelyekkel pl. az égbolt felső részét sötétíthetjük, vagy színezhetjük ki, míg a horizont alatti területet érintetlenül hagyhatjuk. Az ilyen feladatokra mozgathatóságuk miatt a lapszűrők alkalmasabbak.</p>
    <${EnlargeableFigure} thumbnailFileName="Cokin_filters02_500a.jpg" fileName="Cokin_filters02_oa.jpg" altText="Különböző átmenetes szűrők" caption="Különböző átmenetes szűrők" />
    <p>Az átmenetes szűrők használatakor ugyanazok a szabályok érvényesek, mint a polarizációs szűrőknél, azaz az expozíciót érdemes a szűrőzés előtt beállítani, vagy expozíció eltolást használni.</p>
    <${EnlargeableFigure} fileName="fotozz_230942.jpg" altText="Sunshine" caption="Fotó: Gál Zoltán (Yoachim)" />
    <p>Közvetlenül az objektívre tekerhetők az ún. csillag szűrők, amelyek az apróbb fénypontokból csillagszerű hatást hoznak létre. Ilyen szűrőből többféle is létezik, 4, 6 vagy 8 ágú csillag effekthez. Ízlés kérdése, de véleményem szerint a legszebbek a 6 ágúak.</p>
    <${EnlargeableFigure} thumbnailFileName="Phottix_starfilter_inhand_240d.jpg" fileName="Phottix_starfilter_inhand_800d.jpg" altText="Csillag szűrő" />

    <${ImageComparisonWithSlider} fileName1="01_star_wofilter_400a.jpg" fileName2="02_star_wfilter_400a.jpg" width="400px" caption="Sigma 10-20mm f/4-5.6 szűrő nélkül és csillag trükk szűrővel" />
    <${ImageComparisonWithSlider} fileName1="03_star_wofilter_400a.jpg" fileName2="04_star_wfilter_400a.jpg" width="400px" caption="Sigma 10-20mm f/4-5.6 szűrő nélkül és csillag trükk szűrővel" />
    <${ImageComparisonWithSlider} fileName1="05_star_wofilter_400a.jpg" fileName2="06_star_wfilter_400a.jpg" width="400px" caption="Sigma 10-20mm f/4-5.6 szűrő nélkül és csillag trükk szűrővel" />
    <p>A felsoroltakon kívül még további szűrők is léteznek, különböző trükkszűrők, amelyek megsokszorozzák a kép egy részén előforduló témát, vagy a lágyító szűrő, amelyek portrék fotózásánál lehetnek hasznosak, ezek azonban a digitális képfeldolgozás korában már kevésbé szükségesek és könnyedén szimulálható a hatásuk.</p>
</div>`;
}