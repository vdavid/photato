import React from '../../web_modules/react.js';
import PhotatoEmoji from '../../website/components/PhotatoEmoji.mjs';

// noinspection JSUnusedGlobalSymbols, JSNonASCIINames, NonAsciiCharacters, SpellCheckingInspection
export const translations = {
    /* Most strings are missing from here because the English phrases in the code are just fine for the English version. */

    /* Loading page */
    'Loading seems to take longer than usual. If you think this is a problem, please report it here.': {translation: <>Loading seems to take longer than usual. If you think this is a problem, please report it at <a href="mailto:photatophotato@gmail.com?subject=Problem with website, loading for too long!">photatophotato@gmail.com</a>.</>, format: 'jsx'},

    /* Article pages */
    'Photato cached version': {translation: <><PhotatoEmoji /> cached version</>, format: 'jsx'},

    /* Materials page */
    'Some of these articles are not our own. [...]': {
        translation: <>
            <em>Some of these articles are not our own.</em> We just like them very much. You’ll recognize them easily because the original author is specified, and the link looks different.<br/>
            Sadly, these great articles tend to disappear from the internet over the years. To protect them, we created cached copies for some.<br/>
            Unless the link is broken, we advise you to <em>read the original version</em> to support its authors with your visit and ad views.</>, format: 'jsx'
    },
};