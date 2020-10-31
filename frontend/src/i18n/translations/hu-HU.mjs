import React from '../../web_modules/react.js';
import PhotatoEmoji from '../../website/components/PhotatoEmoji.mjs';

// noinspection JSUnusedGlobalSymbols, JSNonASCIINames, NonAsciiCharacters, SpellCheckingInspection
const siteHeaderAndFooterTranslations = {
    'Photato': {translation: 'Photato'},
    'Made with ❤️ by the Photato team': {translation: 'Készítette szeretettel ❤️ a Photato csapat'},
    'Home': {translation: 'Főoldal'},
    'About': {translation: 'Rólunk'},
    'FAQ': {translation: 'GYIK'},
    'Contact': {translation: 'Kapcsolat'},
    'Admin': {translation: 'Admin'},
    'Materials': {translation: 'Tananyag'},
    'Sitemap generator': {translation: 'Sitemap generátor'},
    'Photo upload': {translation: 'Fotó feltöltés'},
    'Challenges': {translation: 'Feladatok'},
    'Sign in': {translation: 'Bejelentkezés'},
    'Sign out': {translation: 'Kijelentkezés'},
    'Profile picture': {translation: 'Profilkép'},

    'Photato’s Facebook page': {translation: 'A Photato Facebook oldala'},
    'Photato’s Instagram': {translation: 'A Photato Instagram oldala'},
};

// noinspection JSUnusedGlobalSymbols, JSNonASCIINames, NonAsciiCharacters, SpellCheckingInspection
const challengeTranslations = {
    'Foodie shot': {translation: 'Gasztrofotó'},
    'Buildings': {translation: 'Épületfotó'},
    'Close-up photography': {translation: 'Makró'},
    'Street photography': {translation: 'Utcai fotó'},
    'Sports photos / Dynamic shots / Fast objects': {translation: 'Sportfotó'},
    'Animals, plants': {translation: 'Állatok, növények'},
    'Long exposure, light painting': {translation: 'Hosszú exponálási idejű kép'},
    'Still life': {translation: 'Csendélet'},
    'Portrait': {translation: 'Portréfotó'},
    'Event: party, concert, group': {translation: 'Eseményfotó'},
    'Self portrait': {translation: 'Önarckép'},
    'Freestyle—take your best shot!': {translation: 'Freestyle – szabad fotózás'},
};

// noinspection JSUnusedGlobalSymbols, JSNonASCIINames, NonAsciiCharacters, SpellCheckingInspection
const challengePageTranslations = {
    'Back to the course page': {translation: 'Vissza a tanfolyam oldalára'},
    'Current challenge': {translation: 'E heti feladat'},
    'Loading challenge...': {translation: 'Töltjük a feladatot...'},
    'Sorry, this challenge hasn’t been translated to your language yet.': {translation: 'Ezt a feladatot sajnos még nem fordítottuk le a te nyelvedre.'},
    'This week’s challenge': {translation: 'E heti feladat'},
    'Deadline to submit your shot': {translation: 'Beküldési határidő'},
    'Previous challenges': {translation: 'Korábbi feladatok'},
    'The course started {approximateWeeksAgo} ({exactDate}).': {translation: 'A tanfolyam {approximateWeeksAgo} ({exactDate}) kezdődött.'},
    'about {weekIndex} weeks ago': {translation: 'kb. {weekIndex} hete'},
    'recently': {translation: 'nemrég'},
    'The course hasn’t started. It’ll start in only {dayCount} days, on {exactDate}!': {translation: 'A tanfolyam még nem indult el, de már csak {dayCount} nap és kezdünk! (A pontos dátum: {exactDate})'},
    'If you’ve signed up, you’ll get an email on the next steps in {dayCount} days.': {translation: 'Ha már feliratkoztál, {dayCount} nap múlva kapsz egy e-mailt a következő lépésekről.'},
    'In case you haven’t': {translation: 'Ha pedig még nem'},
    'Unfortunately, it’s already over. But you can sign up to the next course if you still want to study photography.': {translation: 'Sajnos azóta vége lett. Viszont feliratkozhatsz a következő tanfolyamra, ha még mindig szívesen tanulnál fotózni.'},
};

// noinspection JSUnusedGlobalSymbols, JSNonASCIINames, NonAsciiCharacters, SpellCheckingInspection
const articlePageTranslations = {
    'Loading article...': {translation: 'Töltjük a cikket...'},
    'Loading articles...': {translation: 'Töltjük a cikkeket...'},
    'Back to the list of materials': {translation: 'Vissza a tananyagok listájához'},
    'Author': {translation: 'Szerző'},
    'Publication date': {translation: 'Dátum'},
    'Original article': {translation: 'Eredeti cikk'},
    'On this page we list articles that we found useful. [...]': {
        translation: <>
            Olyan cikkeket szedtünk össze ide, amiket mi hasznosnak találtunk.<br/>
            <em>Ezeket a cikkeket nem mi írtuk.</em> Csak szerintünk nagyon jók.<br/>
            Sajnos azt tapasztaltuk, ezek a remek cikkek az évek alatt gyakran eltűnnek az internetről. Hogy később is meglegyenek, elmentettük a másolataikat ide az oldalra.<br/>
            Ha működik az eredeti link, arra kérünk, <em>olvasd az eredetit</em>, a látogatásoddal támogatva a szerzőket.</>, format: 'jsx'
    },
    'The course hasn’t started. Helpful articles will be added here as the course progresses. Check back later!': {translation: 'A tanfolyam még nem kezdődött el. A kurzus előrehaladtával hasznos cikkek fognak idekerülni. Nézz vissza később!'},
    'Articles about photography': {translation: 'Cikkek fotózás témában'},
    'Photato cached version': {translation: <><PhotatoEmoji /> mentett verzió</>, format: 'jsx'},
};

// noinspection JSUnusedGlobalSymbols, JSNonASCIINames, NonAsciiCharacters, SpellCheckingInspection
const uploadPageTranslations = {
    'Upload your weekly photo': {translation: 'Töltsd fel a heti fotód'},
    'Upload your best photo': {translation: 'Töltsd fel a legjobb fotód'},
    'Week #{weekIndex}': {translation: '{weekIndex}. hét'},
    'Submit your pic before {deadline}.\nNote: Please upload a photo you made this week. If you want to share your older pics, you’re welcome to send them in to the Facebook group.\nReminder: if you already submitted a photo this week, the new picture will replace it.': {translation: 'Küldd be a fotód {deadline} előtt.\nFontos: Kérünk, hogy a héten készült, friss képet küldj be. Ha szeretnéd néhány régebbi fotódat is megosztani a közösséggel, bátran küldd be őket a Facebook csoportba.\nNe feledd: ha már töltöttél fel fotót a héten, az új kép lesz az érvényes.'},
    'Upload': {translation: 'Feltöltés'},
    'Please select your photo to upload.': {translation: 'Válaszd ki a feltöltendő fotót.'},
    'The image you’ve selected is smaller than {minimumSize} kilobytes. This is just too small. Please select a bit higher resolution photo.':
        {translation: 'A kiválasztott képed kisebb, mint {minimumSize} kilobájt. Ez sajnos túl kicsi. Kérlek, válassz egy kicsit jobb felbontású fotót.'},
    'The image you’ve selected is larger than {maximumSize} megabytes. We can’t handle a photo this big. Please select a smaller photo.':
        {translation: 'A kiválasztott képed nagyobb, mint {maximumSize} megabájt. Sajnos ekkora képet nem tudunk kezelni. Kérlek, válassz egy kisebb fotót.'},
    'The image you’ve selected is not a JPEG. Please select a JPEG file.': {translation: 'A kiválasztott fájl nem egy JPEG kép. Jelenleg sajnos csak JPEG képeket tudunk elfogadni. Kérlek, alakítsd át a képed JPEG formátumra.'},
    'Photo is ready to upload. (Make sure you gave it a title if you wanted!)': {translation: 'A fotó készen áll a feltöltésre. (Ne felejtsd el megadni a címet, ha szeretnéd!)'},
    'Uploading your photo...': {translation: 'A fotód épp töltődik felfelé...'},
    'We got your photo! Remember, if you want to change it, you can upload a new one by the end of the week.': {translation: 'Megkaptuk a fotód! Ne feledd, a hét végéig módosíthatod a döntésed: ha változtatnál, csak tölts fel egy új képet.'},
    'Upload failed. Sorry about it. We don’t know what’s wrong. Please refresh the page and try again. It it keeps on failing, please drop us an email at {emailAddress}.':
        {translation: 'Nem sikerült feltölteni a képet. Bocsánat, nem tudjuk, mi lehet a baj. Frissítsd az oldalt és próbáld újra a feltöltést. Ha nem sikerül feltölteni, írj nekünk egy emailt a {emailAddress} címre.'},
    'Give your photo a title (optional)': {translation: 'Adj címet a fotódnak (nem kötelező)'},
    'Click here to select your photo, or drop your photo here': {translation: 'Kattints ide a fotód kiválasztásához, vagy húzd ide az egérrel'},
    'Week {weekIndex}:': {translation: '{weekIndex}. hét –'},
    'The course has already ended. You can’t upload pics anymore. ☹': {translation: 'A tanfolyam véget ért. Már nem tudsz fotókat feltölteni. ☹'},
    'The course has not started. You can upload your photos soon! 😊': {translation: 'A tanfolyam még nem kezdődött el. Hamarosan feltöltheted a fotóid! 😊'},
    'You’ll need to sign in to upload a photo.': {translation: 'Fotó feltöltéséhez be kell jelentkezned.'},
    'Loading...': {translation: 'Betöltés folyamatban...'},
};

// noinspection SpellCheckingInspection
const adminTranslations = {
    'Messages': {translation: 'Üzenetek'},
    'Re-download all messages': {translation: 'Újratöltés a szerverről'},
    'Loading message...': {translation: 'Az üzenet betöltése folyamatban...'},
    'Back to the list of messages': {translation: 'Vissza az üzenetek listájához'},
};

// noinspection SpellCheckingInspection,JSNonASCIINames,NonAsciiCharacters
const otherTranslations = {
    'Frequently asked questions': {translation: 'Gyakran ismételt kérdések'},
    'Sign up for the next course': {translation: 'Feliratkozom a következő tanfolyamra'},
    'Sign up for the next free course': {translation: 'Feliratkozom a következő ingyenes tanfolyamra'},
    /* Loading page */
    'Loading seems to take longer than usual. If you think this is a problem, please report it here.': {translation: <>Úgy tűnik, a betöltés tovább tart, mint szokott. Ha szerinted nálunk van a gond, légyszi jelezd ezt a <a href="mailto:photatophotato@gmail.com?subject=Weboldal probléma, sokáig tart a betöltés!">photatophotato@gmail.com</a> címen.</>, format: 'jsx'},
    /* 404 page */
    '404 error': {translation: '404-es hiba'},
    'Dead potato': {translation: 'Halott krumpli'},
    'This page does not exist': {translation: 'Ez az oldal nem létezik.'},
    'Return to the Photato main page.': {translation: 'Vissza a Photato főoldalára'},
    /* Front page */
    'Welcome to Photato, {firstName}!': {translation: 'Üdv a Photaton, {firstName}!'},
    'Welcome to Photato!': {translation: 'Üdv a Photaton!'},
    '12 weeks, 12 pics': {translation: '12 hét, 12 kép'},
    /* Bug report */
    'Found a bug?': {translation: 'Hibát találtál?'},
    'Bug report': {translation: 'Hibajelentés'},
};

// noinspection JSUnusedGlobalSymbols, JSNonASCIINames, NonAsciiCharacters, SpellCheckingInspection
export const translations = {
    ...siteHeaderAndFooterTranslations,
    ...challengeTranslations,
    ...challengePageTranslations,
    ...articlePageTranslations,
    ...uploadPageTranslations,
    ...adminTranslations,
    ...otherTranslations,
};