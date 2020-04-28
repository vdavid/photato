import React from '../../web_modules/react.js';
import FullWidthLocalImage from './FullWidthLocalImage.mjs';
import PhotoUploadLink from './PhotoUploadLink.mjs';
import ExternalLink from '../../materials/components/ExternalLink.mjs';
/**
 * @param {string} formattedDeadline
 * @returns {React.ReactElement}
 */
export default function Week6Challenge({formattedDeadline}) {
// noinspection SpellCheckingInspection
    return <>
<p>Kedves *|FNAME|*,</p>
<p><strong>Röviden:</strong></p>
<p>Ezen a héten egy <strong>élőlényekről készült fotót</strong> várunk tőled. <PhotoUploadLink label="Itt tudod feltölteni" />.</p>
<p><strong>Hosszabban:</strong></p>
<FullWidthLocalImage fileName="jellyfish.jpg" altText="Medúza." />
<p>A múlt héten egészen sok elméletet vettünk. Most lazítunk egy kicsit, csak a fókuszáláshoz adunk pár egyszerű tippet. 😊</p>

<p>Tippek fókuszáláshoz:</p>

<p>Valószínűleg előfordult már veled, hogy az egyébként jól sikerült (elég fényes, nem bemozdult) képeden nem pont az a rész volt éles, amit meg szerettél volna mutatni a képen. Tág blendénél ez különösen fontos, hiszen (ahogy a korábbi hetekben megtanultuk) ekkor kicsi a mélységélesség, “kevés dolog lesz éles”. Utólag ezen sajnos már nem lehet javítani, de most megnézzük, hogyan lehet jól beállítani a fókuszt a fényképezéskor. Három megoldásunk van erre:</p>
<ol>
    <li><strong>Autofókusz:</strong> Ha fényképezőgéppel fotózol, és automata fókuszt használsz (a legtöbb gépen ez az alapbeállítás): ha félig lenyomod az exponáló gombot, a géped rá fog élesíteni a kép közepére, és ha így, félig lenyomva tartod a gombot, megtartja a fókuszt. Amikor fényképezni akarsz, csak lenyomod a gombot teljesen és a kép azonnal elkészül. Ha még sosem próbáltad ezt, próbáld ki most!</li>
    <li><strong>Manuális fókusz:</strong> A legtöbb fényképezőgépen ki lehet kapcsolni az automata fókuszt és kézzel beállítani, hogy mi legyen éles. Néhány helyzetben ez a nyerő: a fókuszálás időbe telik, tipikusan 0.3-0.8 másodpercbe. Ez gyorsan mozgó fotótéma esetében (pl. majmok) túl sok lehet. Ezért, ha tudod előre, hogy milyen távolságban lesz a fotótémád, beállíthatod a manuális fókuszt előre, és innentől csak kattogtathatsz. A képek így is sokkal gyorsabban fognak elkészülni, mint autofókusz esetén.</li>
    <li><strong>Mobillal:</strong> Ha mobillal fotózol, a legtöbb kamera appban ha rápöttyintesz a képernyőre a kis virsli ujjaddal, a kamera ráélesít a képnek arra a részére, amit megérintettél.</li>
</ol>

<p>A legjobb képedet ${formattedDeadline}-ig, <PhotoUploadLink label="itt tudod feltölteni" />. (Megjegyzés: időről időre előfordul, hogy valaki egynél több képet küld be egy héten. Az igazságosság jegyében – hogy legyen lehetőséged javítani, de ne osszunk meg egy embertől több képet – ilyenkor a legutoljára beküldött képet szoktuk betenni a galériába.)</p>
<p>Tehát állatok és növények. A feladatot értelmezd, ahogyan szeretnéd: fotózhatsz csemegeuborkától hangyákon át elefántfókákig bármit. 😊</p>

<p>Tippek, cikkek:</p>
<ul>
    <li>Ha szép, tiszta az idő, valószínűleg kültéri fotókkal jársz a legjobban. Ha borús az idő, próbálkozz állatok helyett növényekkel.</li>
    <li>Ha a kiskutyád/kiscicád/kismalacod fotóznád: <ExternalLink href="https://www.haziallat.hu/allati-trendi/technika/allatok-fotozasa-trukkok/1897/">haziallat.hu</ExternalLink></li>
    <li>Ha az állatkertbe mennél: <ExternalLink href="https://www.origo.hu/techbazis/20080426-fotozas-az-allatkertben.html">origo</ExternalLink></li>
    <li>Ha növényeket fotóznál: <ExternalLink href="https://fotosuli.blog.hu/2017/01/25/unja_a_telet_keszuljon_fel_a_tavaszra_i_resz">fotosuli.blog.hu</ExternalLink></li>
    <li>Egy profi növényfotós egy napja: <ExternalLink href="https://vimeo.com/90952372">Vimeo</ExternalLink>
    </li>
</ul>

<p>Inspiráció: <ExternalLink href="https://hu.pinterest.com/search/pins/?q=animal%20photography">Pinterest: állatok</ExternalLink> | <ExternalLink href="https://hu.pinterest.com/search/pins/?q=pet%20photography">Pinterest: háziállatok</ExternalLink> | <ExternalLink href="https://hu.pinterest.com/search/pins/?q=plant%20photography">Pinterest: növények</ExternalLink> | <ExternalLink href="https://mobilephotoawards.com/nature-wildlife-winner-honorable-mentions-7th-annual-mpa/">Mobile Photo Awards 2017</ExternalLink> | <ExternalLink href="https://www.nationalgeographic.com/photography/best-of-2017/best-pictures-animals-wildlife-underwater/#/17-best-galapagos-nature-animals-marine-iguanas.jpg">National Geographic 2017</ExternalLink></p>
<p>Ha még nem küldted be a múlt heti (mozgásos) képedet, ma éjfélig még azt is <PhotoUploadLink label="megteheted" />. 🕚</p>
<p>Az élőlényeket pedig még egyszer, <PhotoUploadLink label="itt" /> várjuk!</p>
<p>Jó fotózást,</p>
<p>--<br />
    a Photato csapata</p>
</>;
}