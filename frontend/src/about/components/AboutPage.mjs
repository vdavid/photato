import React from '../../web_modules/react.js';
import {useI18n} from '../../i18n/components/I18nProvider.mjs';
import ExternalLink from '../../materials/components/ExternalLink.mjs';

export default function AboutPage() {
    const {getActiveLocaleCode, __} = useI18n();
    return (getActiveLocaleCode() === 'hu-HU') ? getHungarianPage() : getEnglishPage();

    /*
    Vision/manifesto
    Team
    How to apply
    Transparent work hours and finances
    Website change log
    */


    function getHungarianPage() {
        return <>
            <h1>A Photatoról 🥔📷</h1>
            <p>Ez egy ingyenes fotós tanfolyam kezdőknek és középhaladóknak. Csak egy fényképezőgépre vagy mobilra van szükséged. A tanfolyam 12 hétig tart, minden héten új elméleti tudást és feladatot kapsz. A tanfolyam fotókiállítással zárul (szintén ingyenes). Ha fotózni tanulnál, <ExternalLink href="https://bit.ly/2tB1hpR">iratkozz fel itt</ExternalLink>.</p>
            <h2>A csapat</h2>
            <p><strong>Dávid:</strong> A Photatot <ExternalLink href="http://www.jurikov.com/">Gyuri</ExternalLink> barátom és <ExternalLink href="https://david.veszelovszki.hu/">én</ExternalLink> alapítottuk. Eredetileg én készítettem a húgomnak karácsonyi ajándéknak, de aztán arra gondoltam, másoknak is hasznos lehet. 😊 Az első tanfolyamot 2018-ban indítottuk, úgy, hogy még a tananyag sem volt kész, hétről hétre írtuk Gyurival. A második kurzus már nyugisabb volt, mert a tanayag már kész volt. Itt már Luca húgom segített levezetni a tanfolyamot. Ezután szűk 2 év szünet következett, 2020-ban, Dóri segítségével indítottuk a harmadik kurzust. Közben több lelkes ismerős és ismeretlen segített nekünk a mentorálásban, visszajelzésekkel, a közösség aktívan tartásával.</p>
            <h2>Miért?</h2>
            <p><strong>Dávid:</strong> Számomra a fotózás csak hobbi, de tanítani nagyon szeretek. A napi munkám (<ExternalLink href="https://codeberryschool.com">CodeBerry</ExternalLink>) szintén egy saját vállalkozás, ahol programozást tanítunk. A munkám biztosítja a megélhetésem, emellett akartam egy olyan hobbit, ami nekem kikapcsolódás, de mások is nyernek belőle. Egy ingyenes tanfolyam pont ilyen, a fotózás pedig egy szimpatikus témakör, ami épp megfelelően távol van a programozástól, hogy felfrissülést adjon a munkámból.</p>
            <h2>Mennyibe kerül ez nektek?</h2>
            <p>A tananyagok megírása, honlap, 1 kurzus óraszám. Pénz</p>

            <ExternalLink href="https://bit.ly/2tB1hpR">{__('Sign up for the next course')} →</ExternalLink>
        </>;
    }

    function getEnglishPage() {
        return <>
            <h1>About Photato</h1>
            <p>Photato is a free photo course etc.</p>
        </>;
    }
}


