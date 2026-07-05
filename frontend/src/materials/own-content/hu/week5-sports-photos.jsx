import React from 'react';
import FullWidthLocalImage from '../../../challenges/components/FullWidthLocalImage.jsx';
import ExternalLink from '../../components/ExternalLink.jsx';
import {config} from '../../../config.jsx';
import {NavLink} from 'react-router-dom';

// noinspection JSUnusedGlobalSymbols (This file is loaded dynamically.)
/**
 * @returns {ArticleMetadata}
 */
export function getMetadata() {
    // noinspection SpellCheckingInspection (It's in Hungarian.)
    return {
        slug: 'week5-sports-photos',
        title: 'Tippek sportfotókhoz',
        author: 'Photato',
        publishDate: new Date('2020-06-07'),
        publisherName: 'Photato',
    };
}

// noinspection JSUnusedGlobalSymbols (This file is loaded dynamically.)
/**
 * @returns {React.ReactElement}
 */
export default function Article() {
    // noinspection SpellCheckingInspection (It's in Hungarian.)
    return <>
        <h2>Gyorsan mozgó dolgok fotózása fényképezőgéppel</h2>

        <p>Ha elolvastad a <a href={config.baseUrl + '/hu/article/aperture-shutter-iso'}>Blende, záridő, és ISO érték</a> cikket és kipróbálgattad a beállításokat, állítsd a géped <strong>“záridő-előválasztás” üzemmódba</strong>. Ezt a fényképezőgép típusától függően az “S” (shutter speed) vagy “Tv” (time value) betűk jelölik. Ez a manuális (“M”) módhoz képest azzal könnyíti meg az életed, hogy csak a záridőt és az ISO értéket kell beállítanod, a blendét beállítja magától. Általában ebben a módban érdemes gyorsan mozgó dolgokat fotózni, mert elég pontos beállítást tesz lehetővé viszonylag gyorsan.</p>

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
        </ol>

        <p><strong>Linkek:</strong></p>
        <ul>
            <li>Fotózás alapok: <ExternalLink href="https://fotozasblog.hu/digitalis-fotozas/">rekesz, záridő, zoom</ExternalLink> | <NavLink to="/hu/external-article/fotozasblog-iso-erzekenyseg-fenymeres-beepitett-vaku">fénymérés, ISO, vaku</NavLink>.</li>
            <li><ExternalLink href="http://fotozz.hu/cikket_megmutat?cikk_ID=83">Tippek gyorsan mozgó témákhoz</ExternalLink> a fotozz.hu-tól</li>
            <li><ExternalLink href="https://www.canon.hu/get-inspired/tips-and-techniques/capturing-motion/">Tippek gyorsan mozgó témákhoz</ExternalLink> a Canon oldaláról</li>
            <li><ExternalLink href="http://www.photonet.hu/arhiv/sportfotozas.html">Sportfotózásról</ExternalLink> a Photonet.hu-tól</li>
            <li>Inspiráció: <ExternalLink href="https://hu.pinterest.com/search/pins/?q=sport%20photography">Pinterest sportfotók</ExternalLink> | <ExternalLink href="https://hu.pinterest.com/search/pins/?q=panning%20photography">Pinterest úsztatásos fotók</ExternalLink> | <ExternalLink href="https://hu.pinterest.com/search/pins/?q=chronophotograpy%20sport">Pinterest chronophotography</ExternalLink> | <ExternalLink href="https://mashable.com/2016/09/29/red-bull-photography-contest/?europe=true">Red Bull sportfotók</ExternalLink></li>
        </ul>
    </>;
}