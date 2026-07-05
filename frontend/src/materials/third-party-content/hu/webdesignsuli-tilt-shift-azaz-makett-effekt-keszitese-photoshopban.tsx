import React from 'react';
import EnlargeableFigure from '../../components/EnlargeableFigure';
import type {ArticleMetadata} from '../../types';

/*
 * EnlargeableFigure reads its alt text from an `altText` prop, but the calls below pass `alt`.
 * That prop is silently dropped at runtime (a pre-existing bug), so the images render with no
 * alt text. This typed alias keeps that exact runtime behavior while letting the JSX typecheck.
 */
const Figure = EnlargeableFigure as React.ComponentType<{fileName: string; thumbnailFileName?: string; alt?: string}>;

// noinspection JSUnusedGlobalSymbols (This file is loaded dynamically.)
export function getMetadata(): ArticleMetadata {
    // noinspection SpellCheckingInspection (It's in Hungarian.)
    return {
        slug: 'webdesignsuli-tilt-shift-azaz-makett-effekt-keszitese-photoshopban',
        title: 'Tilt Shift, azaz makett effekt készítése Photoshopban',
        author: 'Webdesigner blog',
        publishDate: new Date('2014-11-04'),
        publisherName: 'Webdesignsuli',
        originalUrl: 'http://webdesignsuli.hu/webdesigner_blog/tilt-shift-azaz-makett-effekt-keszitese-photoshopban/',
        isOriginalUrlBroken: false,
    };
}

// noinspection JSUnusedGlobalSymbols (This file is loaded dynamically.)
export default function Article() {
    // noinspection SpellCheckingInspection (It's in Hungarian.)
    return <>
        <p>Egyre népszerűbb az úgynevezett Tilt Shift, azaz makett effekt használata fotókon. Ennek az effektnek a hatására olyanok lesznek a képeink, mintha egy miniatűr város vagy mini/makett világ részleteit néznénk. Sőt már Tilt Shift effektes videókkal is találkozhatunk.</p>
        <p>Elsősorban a részletekben gazdag fotók alkalmasak az ilyen effektekre, illetve a legjobb, ha a kép kissé felülnézetből készül, mintha valóban rálátnánk a kép tárgyára, például városkép esetében.</p>
        <p>Nézzük hát lépésről lépésre ennek az egyszerű, de annál látványosabb effektnek a készítését.</p>
        <p>1. Nyissuk meg Photoshopban az effektezni kívánt fotónkat.</p>
        <Figure fileName="step1.jpg" thumbnailFileName="step1-500x312.jpg" alt="step1"/>
        <p>2. Ctrl+J gomb megnyomásával készítsünk egy másolatot a képről. (ezzel a kombinációval gyorsan és hatékonyan duplázhatjuk meg azt a réteget amin éppen állunk).</p>
        <p>Ezután adjunk a képhez egy korrekciós réteget, mégpedig a Színezett/telítettség korrekciós réteget.</p>
        <p>Ezt három módon is megtehetjük: (többek közt ezért imádom a Photoshopot 🙂 )</p>
        <p>a) Látható, hogy nekem jobb oldalon alapbeállításként szerepel a korrekciós panel (a kis kép fölött látszik), mivel én nagyon sokat használom. Tehát innen azonnal kiválasztható a Színezett/telítettség korrekciós réteg.</p>
        <p>b) Jobb oldalon alul a kis ikonok között válasszuk a fekete/fehér kört és itt válasszuk ki a Színezett/telítettség korrekciós réteget.</p>
        <p>c) Menüsorban válasszuk a Réteg/Új korrekciós réteg Színezett/telítettség… lehetőséget.</p>
        <p>A Színezett/telítettség korrekciós réteg panelen a színtelítettséget növeljük meg, hogy a színek intenzívebbek legyenek.</p>
        <Figure fileName="step2.jpg" thumbnailFileName="step2-500x312.jpg" alt="step2"/>
        <p>3. Most álljunk a képünk másolatának rétegére és nyissuk meg a Szűrő/Életlenítés/Makett.. menüpontot.</p>
        <Figure fileName="step3.jpg" thumbnailFileName="step3-500x312.jpg" alt="step3"/>
        <p>4. Ekkor egy új ablakban nyílik meg a képünk rajta néhány vonallal:</p>
        <Figure fileName="step4.jpg" thumbnailFileName="step4-500x312.jpg" alt="step4"/>
        <p>5. A középső kört megfogva az egérrel húzzuk a középpontot a házak vonalához (ez a rész lesz a legélesebb). A két egyenes vonal jelöli azt a részt, ameddig teljesen éles a kép. Az egyenes vonal és a szaggatott vonal közti rész az átmenetes rész, a szaggatott vonal feletti pedig a homályosított, azaz életlenített rész lesz. Ezeket a vonalakat tetszőlegesen állíthatjuk. A középső kört egérrel fogva, ha a potmétert arrébb húzzuk, az életlenséget csökkenthetjük illetve növelhetjük ízlés szerint (ezt amúgy az oldalsávban is megtehetjük).</p>
        <Figure fileName="step5.jpg" thumbnailFileName="step5-500x312.jpg" alt="step5"/>
        <p>6. Ha készen vagyunk, akkor felül okézzuk le, Így visszakerülünk a normál nézetbe és láthatjuk is, hogy a másolat réteg már effektezve van. El is készültünk. Ha szeretnénk, még egy kicsit feldobhatjuk a hatást. 🙂 Nyissunk egy új réteget legfelülre a réteg palettán és töltsük ki feketével. (Válasszuk háttérszínnek – alsó szín – a feketét, majd az új rétegen állva nyomjunk Ctrl+Del kombinációt.</p>
        <Figure fileName="step6.jpg" thumbnailFileName="step6-500x312.jpg" alt="step6"/>
        <p>7. Most a fekete réteg láthatóságát vegyük le kb 25%-ra, majd válasszuk ki a radír eszközt. Válasszunk puha ecsetet és vegyük jó nagy méretre (kb. a kép magasságának 2/3-ára), majd radírozzunk bele a fekete réteg közepére.</p>
        <Figure fileName="step7.jpg" thumbnailFileName="step7-500x312.jpg" alt="step7"/>
        <p>
            <strong>Wow! 🙂 El is készültünk a makett effekttel.</strong>
        </p>
        <Figure fileName="tilt-shift.jpg" thumbnailFileName="tilt-shift-500x327.jpg" alt="tilt shift"/>
        <Figure fileName="tilt-shift2.jpg" thumbnailFileName="tilt-shift2-500x333.jpg" alt="tilt shift2"/>
    </>;
}