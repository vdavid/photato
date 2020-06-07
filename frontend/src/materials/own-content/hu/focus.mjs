import React from '../../../web_modules/react.js';
import {config} from '../../../config.mjs';

// noinspection JSUnusedGlobalSymbols (This file is loaded dynamically.)
/**
 * @returns {ArticleMetadata}
 */
export function getMetadata() {
    // noinspection SpellCheckingInspection (It's in Hungarian.)
    return {
        slug: 'focus',
        title: 'Fókuszálás',
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
        <p>Tippek fókuszáláshoz:</p>

        <p>Valószínűleg előfordult már veled, hogy az egyébként jól sikerült (elég fényes, nem bemozdult) képeden nem pont az a rész volt éles, amit meg szerettél volna mutatni a képen. Tág blendénél ez különösen fontos, hiszen (ahogy a korábbi hetekben megtanultuk) ekkor kicsi a mélységélesség, “kevés dolog lesz éles”. Utólag ezen sajnos már nem lehet javítani, de most megnézzük, hogyan lehet jól beállítani a fókuszt a fényképezéskor. Három megoldásunk van erre:</p>
        <ol>
            <li><strong>Autofókusz:</strong> Ha fényképezőgéppel fotózol, és automata fókuszt használsz (a legtöbb gépen ez az alapbeállítás): ha félig lenyomod az exponáló gombot, a géped rá fog élesíteni a kép közepére, és ha így, félig lenyomva tartod a gombot, megtartja a fókuszt. Amikor fényképezni akarsz, csak lenyomod a gombot teljesen és a kép azonnal elkészül. Ha még sosem próbáltad ezt, próbáld ki most!</li>
            <li><strong>Manuális fókusz:</strong> A legtöbb fényképezőgépen ki lehet kapcsolni az automata fókuszt és kézzel beállítani, hogy mi legyen éles. Néhány helyzetben ez a nyerő: a fókuszálás időbe telik, tipikusan 0.3-0.8 másodpercbe. Ez gyorsan mozgó fotótéma esetében (pl. majmok) túl sok lehet. Ezért, ha tudod előre, hogy milyen távolságban lesz a fotótémád, beállíthatod a manuális fókuszt előre, és innentől csak kattogtathatsz. A képek így is sokkal gyorsabban fognak elkészülni, mint autofókusz esetén.</li>
            <li><strong>Mobillal:</strong> Ha mobillal fotózol, a legtöbb kamera appban ha rápöttyintesz a képernyőre a kis virsli ujjaddal, a kamera ráélesít a képnek arra a részére, amit megérintettél.</li>
        </ol>

        <p>Most, hogy ezt a cikket elolvastad, ajánljuk az <a href={config.baseUrl + '/hu/article/week6-animals-plants'}>Állat- és növényfotózás tippek</a>et a gyakorláshoz.</p>
    </>;
}
