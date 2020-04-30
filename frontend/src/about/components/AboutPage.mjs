import React from '../../web_modules/react.js';
import {useI18n} from '../../i18n/components/I18nProvider.mjs';

export default function AboutPage() {
    const {getActiveLocaleCode} = useI18n();
    return (getActiveLocaleCode() === 'hu-HU') ? getHungarianPage() : getEnglishPage();
}

function getHungarianPage() {
    return <>
        <h1>About Photato</h1>
        <p>Photato is a free photo course etc.</p>
    </>;
}

function getEnglishPage() {
    return <>
        <h1>About Photato</h1>
        <p>Photato is a free photo course etc.</p>
    </>;
}

/*
Vision/manifesto
Team
How to apply
Transparent work hours and finances
Website change log
*/

/*
Üdv a Photaton! :) Ez egy ingyenes fotós tanfolyam kezdőknek és középhaladóknak. Csak egy fényképezőgépre vagy mobilra van szükséged. A tanfolyam 12 hétig tart, minden héten új elméleti tudást és feladatot kapsz. A tanfolyam fotókiállítással zárul (szintén ingyenes). Ha fotózni tanulnál, lájkold be az oldalt és iratkozz fel.

 */