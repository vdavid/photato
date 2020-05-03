import React, {useEffect} from '../../web_modules/react.js';
import {useI18n} from '../../i18n/components/I18nProvider.mjs';
import ExternalLink from '../../materials/components/ExternalLink.mjs';
import {NavLink} from '../../web_modules/react-router-dom.js';

export default function ContactPage() {
    const {__, getActiveLocaleCode} = useI18n();

    useEffect(() => {document.title = __('Contact') + ' - Photato'}, []);

    return (getActiveLocaleCode() === 'hu-HU') ? getHungarianPage() : getEnglishPage();
}

function getHungarianPage() {
    return <>
        <h1>Kapcsolat 🥔🤙</h1>
        <p>Elérsz minket:</p>
        <ul>
            <li>E-mailben: <a href="mailto:photatophotato@gmail.com">photatophotato@gmail.com</a></li>
            <li>Facebookon: <ExternalLink href="https://fb.com/photatophotato">https://fb.com/photatophotato</ExternalLink></li>
            <li>Instagramon: <ExternalLink href="https://www.instagram.com/photatocourse">https://www.instagram.com/photatocourse</ExternalLink></li>
        </ul>

        <p>Segíts, ha van kedved:</p>
        <ul>
            <li><a href="mailto:photatophotato@gmail.com?subject=Mentornak jelentkezem">Jelentkezz mentornak</a></li>
            <li>Vidd hírünket, pl. postolj a Facebook faladra valami ilyet: “Találtam egy ingyenes online fotóssulit, krumplikat lehet fotózni. 😄 Hamarosan indul a következő tanfolyamuk, itt lehet jelentkezni: <ExternalLink href="https://bit.ly/2tB1hpR">https://bit.ly/2tB1hpR</ExternalLink> 🍠”</li>
        </ul>

        <p>További infók:</p>
        <ul>
            <li><NavLink to="/about">Rólunk</NavLink></li>
            <li><NavLink to="/faq">Gyakran ismételt kérdések</NavLink></li>
        </ul>
    </>;
}

function getEnglishPage() {
    return <>
        <h1>Contact 🥔🤙</h1>
        <p>You can reach us:</p>
        <ul>
            <li>In email: <a href="mailto:photatophotato@gmail.com">photatophotato@gmail.com</a></li>
            <li>On Facebook: <ExternalLink href="https://fb.com/photatophotato">https://fb.com/photatophotato</ExternalLink></li>
            <li>On Instagram: <ExternalLink href="https://www.instagram.com/photatocourse">https://www.instagram.com/photatocourse</ExternalLink></li>
        </ul>

        <p>Help if you feel like it:</p>
        <ul>
            <li><a href="mailto:photatophotato@gmail.com?subject=Mentor application">Jelentkezz mentornak</a></li>
            <li>Spread the word. Post on your wall something like: ‘I’ve found a free photo school where you can shoot potatoes. 😄 Their next course is starting soon, apply here: <ExternalLink href="https://bit.ly/2tB1hpR">https://bit.ly/2tB1hpR</ExternalLink> 🍠’</li>
        </ul>

        <p>More info:</p>
        <ul>
            <li><NavLink to="/about">About us</NavLink></li>
            <li><NavLink to="/faq">Frequently asked questions</NavLink></li>
        </ul>
    </>;
}
