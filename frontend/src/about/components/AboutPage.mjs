import React from '../../web_modules/react.js';
import {useI18n} from '../../i18n/components/I18nProvider.mjs';
import ExternalLink from '../../materials/components/ExternalLink.mjs';

export default function AboutPage() {
    const {getActiveLocaleCode, __} = useI18n();
    return (getActiveLocaleCode() === 'hu-HU') ? getHungarianPage() : getEnglishPage();

    function getHungarianPage() {
        return <>
            <h1>A Photatoról 🥔📷</h1>
            <p>Ez egy ingyenes fotós tanfolyam kezdőknek és középhaladóknak. Csak egy fényképezőgépre vagy mobilra van szükséged. A tanfolyam 12 hétig tart, minden héten új elméleti tudást és feladatot kapsz. Az 5. hét környékén szokott lenni egy közösen fotózós esemény. A tanfolyam fotókiállítással zárul (szintén ingyenes), Budapesten, a <ExternalLink href="https://szimpla.hu/">Szimplában</ExternalLink> szoktunk tartani. Ha fotózni tanulnál, <ExternalLink href="https://bit.ly/2tB1hpR">iratkozz fel itt</ExternalLink>.
            </p>

            <h2>Pár szó a történetünkről</h2>
            <p>
                <strong>Dávid:</strong> A Photatot <ExternalLink href="http://www.jurikov.com/">Gyuri</ExternalLink> barátom és <ExternalLink href="https://david.veszelovszki.hu/">én</ExternalLink> alapítottuk. Eredetileg én készítettem a húgomnak karácsonyi ajándéknak, de aztán arra gondoltam, másoknak is hasznos lehet. 😊 Eddig 3 db 3 hónapos tanfolyamot tartottunk, összesen 549 embernek. Az elsőt 2018-ban indítottuk, úgy, hogy még a tananyag sem volt kész, hétről hétre írtuk Gyurival. A második kurzus már nyugisabb volt, mert a tanayag már kész volt. Itt már Luca húgom segített levezetni a tanfolyamot. Ezután szűk 2 év szünet következett. 2020-ban, Dóri segítségével indítottuk a harmadik kurzust. Közben több lelkes ismerős és ismeretlen segített nekünk a mentorálásban, visszajelzésekkel, a közösség aktívan tartásával.
            </p>
            <p>Az eddigi 3 tanfolyam 116, 86, és 347 diákkal indult. Összesen 1 081 érvényes beadást kaptunk a hetek során, a tanfolyamok végén pedig összesen 50 értékes díjat osztottunk ki. 🥔</p>

            <h2>Miért? És miért ingyen?</h2>
            <p>
                <strong>Dávid:</strong> Mert hiszünk abban, hogy ha az emberek a szabadidejüket azzal töltik, hogy adnak egymásnak dolgokat, akkor jobb lesz a világ. Mi fotózni és tanítani szeretünk, ezért mi ezt adjuk.
            </p>
            <p>Számomra pl. a fotózás csak hobbi, de tanítani nagyon szeretek. A napi munkámban (<ExternalLink href="https://codeberryschool.com">CodeBerry</ExternalLink>, szintén saját vállalkozás) is tanítunk, programozást. A csapatban mind úgy vagyunk, hogy a munkánk biztosítja a megélhetésünket, emellett a Photato egy jó kikapcsolódás, amiből mások is kapnak értéket.
            </p>

            <h2>Mennyibe kerül ez nektek?</h2>
            <p>
                <strong>Dávid</strong>: Nem sokba. Két része van: az idő és a pénz.
            </p>
            <p>Időben eddig – 3 év alatt – kb. 360 órát tettünk a tanfolyamba. Ez kb. így oszlik el:</p>
            <ul>
                <li>Az első tanfolyam elején kb. 60 óra volt Gyurinak és nekem megírni a 12 heti feladatot.</li>
                <li>Egy tanfolyamot levezetni kb. 30 óra időtöltés összesen, amit jelenleg Dórival osztunk meg. Ebben benne van a kurzus előkészítése, válaszolgatni a levelekre, a megbeszéléseink, amiket időnként tartunk</li>
                <li>Az első három tanfolyam körül összesen 85 órányi stratégiai megbeszélésünk volt, ahol kitaláltuk, hogy lesz jó/jobb ez az egész.</li>
                <li>A weboldal elkészítésével eddig 126 órát töltöttem.</li>
            </ul>
            <p>Egy tanfolyam költsége átlagosan kb. 8 000 Ft összesen, amiből Facebook hirdetéseket, a legjobb képek kinyomtatását, és egy kis pogácsát és díjakat veszünk a záróeseményre.</p>
            <ExternalLink href="https://bit.ly/2tB1hpR">{__('Sign up for the next course')} →</ExternalLink>

            <h2>Weboldal történet</h2>
            <ul>
                <li>[2020-04-11] v1.0: Kép feltöltés</li>
                <li>[2020-04-27] v2.0: Külsős cikkek</li>
                <li>[2020-05-02] v3.0: Weboldal tartalom, “Rólunk” oldal, FAQ, stb.</li>
            </ul>
        </>;
    }

    function getEnglishPage() {
        return <>
            <h1>About Photato 🥔📷</h1>
            <p>This is a free photography course for beginners and intermediates. You only need a camera or a mobile phone. The course takes 12 weeks: we teach you something and give you a challenge each week. Around the 5th week there’s a live event where we shoot together. The course ends with an exhibition (also free), at <ExternalLink href="https://szimpla.hu/">Szimpla</ExternalLink>, Budapest. If you want to study photography, <ExternalLink href="https://bit.ly/2tB1hpR">sign up here</ExternalLink>.
            </p>
            <p><strong>Important:</strong> this course is currently in Hungarian only. If you speak Hungarian and English, <a href="mailto:photatophotato@gmail.com?I want to help translate!">help us translate</a>.
            </p>
        </>;
    }
}


