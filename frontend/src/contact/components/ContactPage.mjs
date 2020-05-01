import React from '../../web_modules/react.js';
import {useI18n} from '../../i18n/components/I18nProvider.mjs';

export default function ContactPage() {
    const {getActiveLocaleCode} = useI18n();
    return (getActiveLocaleCode() === 'hu-HU') ? getHungarianPage() : getEnglishPage();

    /*
    No phone or physical address, no company
    Email address
    Link to the team info and FAQ
    Becoming a mentor

     */
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
