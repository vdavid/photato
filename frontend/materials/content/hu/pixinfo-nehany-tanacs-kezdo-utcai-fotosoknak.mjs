import {createElement} from '../../../web_modules/react.js';
import htm from '../../../web_modules/htm.js';
import {NavLink} from '../../../web_modules/react-router-dom.js';
import SimpleFigure from '../../components/SimpleFigure.mjs';
const html = htm.bind(createElement);

// noinspection JSUnusedGlobalSymbols (This file is loaded dynamically.)
/**
 * @returns {ArticleMetadata}
 */
export function getMetadata() {
    return {
        slug: 'pixinfo-nehany-tanacs-kezdo-utcai-fotosoknak',
        title: 'Néhány tanács kezdő utcai fotósoknak',
        author: 'Irházy Róbert (Birdie)',
        publishDate: new Date('2012-01-19'),
        publisherName: 'Pixinfo.hu',
        originalUrl: 'https://pixinfo.com/hirek/2012/01/19/nehany-tanacs-kezdo-utcai-fotosoknak/',
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
    <p>Egy korábbi <a href="https://pixinfo.com/hirek/2012/01/03/fekete-hattyu-az-utcan-avagy-mi-a-titka-a-street-photography-nek/" target="_blank">postunkban</a> [<${NavLink} to="/external-article/pixinfo-fekete-hattyu-az-utcan-avagy-mi-a-titka-a-street-photography-nek">Photato mentett verzió</NavLink>] már foglalkoztunk a street photography műfajjal, most újra elővesszük. Igaz ugyanis a mondás, több szem, többet lát. Lássuk, John Batdorff milyen tanácsokkal szolgál a kezdő utcai fotósoknak. A fotográfia egy viszonylag szűk rétegét képezi a bizonyos szempontból szociofotózásnak is tekinthető utcai fotózás, vagy angol nyelvén street photography. A legtöbbször meg nem ismételhető, érdekes, meglepő, vagy éppen meghökkentő pillanatokat elcsípő utcai fotózás nem tartozik a könnyű műfajok közé. Tárgyfotózni, makrózni és portrézni is könnyebb, mint az utcai fotózás. Ezek ugyanis előre jól eltervezhetők. Nem úgy az utcai fotózás, ahol az adott pillanatot vagy elkapod, vagy nem. Persze lehet kivárni is és arra játszani, hogy megtörténik újra.</p>
    <${SimpleFigure} fileName="John_Batdorff.jpg" altText="John Batdorff" caption="Fotó: John Batdorff" />
    <p>John Batdorff néhány egyszerű ötlettel szolgál a kezdőknek ahhoz, hogy kicsit gyorsabban fejlődhessünk utcai fotográfussá, mintha mindezt csupán önerőnkből kellene elérni. Nézzük a tippjeit röviden:</p>
    <ul>
    <li>ne zavarj senkit, légy láthatatlan</li>
    <li>próbálkozz nagyobb ünnepségeken, karneválokon, rendezvényeken – itt az emberek nem rád figyelnek majd, hanem magára az előadásra</li>
    <li>hagyd otthon az állványod, válassz olyan objektívet, amely a legtöbb esetben alkalmazható – nem érsz majd rá objektívet cserélgetni és állványbeállítással időzni</li>
    <li>légy türelmes, válassz egy jó helyet és pihenj, de légy résen, várd meg a kellő pillanatot és fotózz!</li>
    </ul>
    <p>Ennyi. Lehet, hogy tényleg elég is.<br />
    Egy dolgot azonban szerintem kifejeltettünk, bár ez nyilván nem tanács kérdése, s ezt már én teszem hozzá:</p>
    <ul>
    <li>legyél kitartó és ne keseredj el, ha első néhány alkalommal nem úgy sikerül, ahogy szeretnéd, a hosszú távú gyakorlás előbb-utóbb meg fogja hozni várt eredményét!</li>
    </ul>
    <p>További képek és részletesebb tanácsok <a href="http://johnbatdorff.com/blog/2011/11/10/simple-ways-to-improve-your-street-photography/" target="_blank">John Batdorff honlapján</a>.</p>
</div>`;
}