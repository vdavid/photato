import React from '../../../web_modules/react.js';
import SimpleFigure from '../../components/SimpleFigure.mjs';

// noinspection JSUnusedGlobalSymbols (This file is loaded dynamically.)
/**
 * @returns {ArticleMetadata}
 */
export function getMetadata() {
    // noinspection SpellCheckingInspection (It's in Hungarian.)
    return {
        slug: 'fotosuli-hogyan-keszitsunk-szep-portrefotot',
        title: 'Hogyan készítsünk szép portréfotót?',
        author: 'Feggaris',
        publishDate: new Date('2016-08-03'),
        publisherName: 'Fotósuli',
        originalUrl: 'https://fotosuli.blog.hu/2016/08/03/hogyan_keszitsunk_szep_portrefotot',
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
        <p>A szemünk a lélek tükre. Az arcunk a személyiségünk. <br/> A portréfotózás a legmélyebb és legbizalmasabb kapcsolat a fotós és a modellje között.
        </p>
        <p>A kijelzőn csak az arc látható, nincs egyéb képelem, amely zavaró. A személyiség ábrázolása azonban nagyon nehéz feladat. El kell érnünk, hogy a modell ne legyen feszült, szégyenlős, mert ellenkező esetben nem tudjuk bemutatni az alanyunk személyiségét és karakterét.</p>

        <SimpleFigure fileName="37074622_m.jpg" altText="Illusztráció"/>
        <p>A portré legérdekesebb része a modell szeme. Amikor megismerünk valakit először a szemébe nézünk, a portrénál a nézők is először a modell szemét keresik a képen. A modell szeméből sugárzó érzelem határozza meg a fotó hangulatát. A képen a modell szemének élesnek kell lennie. Akkor is, ha alacsony mélységélességgel fényképezünk, mindenképp a modell szemére állítsuk az élességet, mégpedig arra a szemére, amelyik közelebb van hozzánk és az optikánkhoz. A szem akkor is legyen éles, ha az arc többi részét nem akarjuk élesen láttatni.</p>
        <p>A portré fotózásra ezért időt kell szánni, meg kell ismerni a modellt. Így tudjuk eldönteni, hogy az alanyunk melyik vonását akarjuk hangsúlyozni és hogyan.</p>
        <p>A legelőnyösebb beállítás, ha a modellt szűk képkivágásban, szemből fotózzuk, amint épp az objektívbe néz. Ez a portrétípus kívánja a legtöbbet a modelltől, hiszen ez egy nagyon bizalmas helyzet, a modellünk nyitott könyv. Ehhez viszont, oldottnak, felszabadultnak kell éreznie magát és természetesen kell viselkednie.</p>
        <p>A deréktájban vágott portré esetében a modell messzebb van a kamerától, ekkor a modell testhelyzete is befolyásolja a kép hangulatát. Álmodozó hatást érünk el, ha a modellünk kinéz a képből és felfelé tekint. Töprengő, elmélkedő hangulatú fotót eredményez, ha a modell a szemét lefelé szegezi.</p>
        <p>Használjunk egyszerű, semleges hátteret, mely nem vonja el a figyelmet a modellről és ügyeljünk a tónuskülönbségekre is, hogy a modell arca ne olvadjon bele a háttérbe.</p>
        <p>Akármilyen beállítást is választunk, fontos a szoros együttműködés a csapatmunka. Ha nem így dolgozunk, a képek semmitmondóak lesznek, nem mutatják meg a modell személyiségét és karakterét, pedig a portréfotóval pont ez a célunk.</p>
    </>;
}