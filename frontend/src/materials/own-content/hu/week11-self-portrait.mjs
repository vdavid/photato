import React from '../../../web_modules/react.js';
import ExternalLink from '../../components/ExternalLink.mjs';

// noinspection JSUnusedGlobalSymbols (This file is loaded dynamically.)
/**
 * @returns {ArticleMetadata}
 */
export function getMetadata() {
    // noinspection SpellCheckingInspection (It's in Hungarian.)
    return {
        slug: 'week11-self-portrait',
        title: 'Önarckép-fotózási tippek',
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
        <p>Egy önarckép lehet egy pillanatkép az életedből; az épp aktuális identitásod képi megfogalmazása; egy időszak összefoglalása; vagy egy mélyebb szembenézés magaddal. Te döntöd el, mit osztasz meg magadról, és hogy ezt hogyan fejezed ki a képpel. Hoztunk neked ehhez 8 tippet és egy csomó ötletet.</p>
        <p><strong>Tippek:</strong></p>
        <ol>
            <li><strong>Gondold át, mit akarsz.</strong> Találd ki, mit szeretnél elmondani magadról. Gondold végig, vagy írd fel néhány tulajdonságod, amit fontosnak tartasz. Válaszd ki azt, amihez a leginkább kedved van.</li>
            <li><strong>Válaszd ki a környezeted.</strong> A téged körülvevő tér is beszél rólad. Mesélhet az életedről, a munkádról, a érdeklődési körödről, a számodra fontos dolgokról és emberekről, a hangulatodról. Nem fontos megmutatnod azonban semmit sem, ha nem akarod.</li>
            <li><strong>Játssz a fényekkel.</strong> Természetes vagy mesterséges fény szeretnél? Éles fényt határozott árnyékokkal, vagy inkább puha, szórt megvilágítást? Látható legyen a háttér, vagy inkább teljesen sötét? Esetleg csak a sziluetted látsszon? Kísérletezz és találd meg a kedvenced.</li>
            <li><strong>Komponálj.</strong> Találd meg a látószöget, magasságot és távolságot, állítsd be a fehéregyensúlyt. Készíts próbafotókat időzítővel, vagy állíts valakit a helyedre, amíg megtalálod a megfelelő beállítást.</li>
            <li><strong>Fixáld a gépet.</strong> Ha tudsz, használj állványt, mert így a legnagyobb szabadságod. Ha nincs állványod, csak tedd le a géped valahova, és mozogj te a géphez képest.</li>
            <li><strong>Időzíts.</strong> Hacsak nem selfie-t csinálsz, szükséged lesz arra, hogy időzítsd vagy távirányítsd a gépet.</li>
            <li><strong>Döntsd el, merre nézel.</strong> Ha egyenesen a kamerába nézel, a kép nézője egy közvetlenebb kapcsolatot érezhet veled. Ha máshová nézel, a néző követheti a tekinteted, elgondolkodhat, vajon mit látsz, merre járhatsz a gondolataidban.</li>
            <li><strong>Légy őszinte.</strong> Ha zavarban vagy, készíts sok próbaképet, hogy megszokd a kamerát és az arcod jól közvetítse, amit ki szeretnél fejezni.</li>
        </ol>
        <p><strong>Rengeteg ötlet és inspiráció:</strong></p>
        <ul>
            <li><ExternalLink href="https://iso.500px.com/creative-self-portraits/">50 önarckép-ötlet</ExternalLink> az 500px-en</li>
            <li>Mobile Photography Awards nyertesek: <ExternalLink href="https://mobilephotoawards.com/self-portraits-winner-honorable-mentions-7th-annual-mpa/">2017</ExternalLink> | <ExternalLink href="https://mobilephotoawards.com/self-portraits-winner-honorable-mentions-6th-annual-mpa/">2016</ExternalLink> | <ExternalLink href="https://mobilephotoawards.com/self-portraits/">2015</ExternalLink></li>
            <li><ExternalLink href="https://hu.pinterest.com/search/pins/?q=self%20portrait%20photography&rs=typed&term_meta[]=self%7Ctyped&term_meta[]=portrait%7Ctyped&term_meta[]=photography%7Ctyped">Pinterest</ExternalLink> önarcképek</li>
            <li><ExternalLink href="http://www.bwvision.com/top-10-self-portraits/">8 fotós (és két festő) önarcképe</ExternalLink></li>
        </ul>
        <p><strong>Linkek:</strong></p>
        <ul>
            <li><ExternalLink href="https://expertphotography.com/how-to-take-flattering-self-portraits/">Tippek angolul</ExternalLink> az expertphotography.com-tól</li>
        </ul>
    </>;
}