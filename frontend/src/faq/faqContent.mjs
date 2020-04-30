import React from '../web_modules/react.js';

export function getSingleLanguageContent(languageCode) {
    return getMultiLanguageContent().map(questionAndAnswer => ({
        question: questionAndAnswer.question[languageCode],
        answer: questionAndAnswer.answer[languageCode]
    }));
}

/**
 * @returns {({question: {en: Component, hu: Component}, answer: {en: Component, hu: Component}})[]}
 */
function getMultiLanguageContent() {
    return [
        {
            question: {
                en: <>What are the prerequisites to join?</>,
                hu: <>Mik a <strong>követelmények</strong> a csatlakozáshoz?</>,
            },
            answer: {
                en: <>Only a camera or mobile phone, and a hand/foot to press the shutter. 😊 You can come as a complete beginner, no previous experience is needed.</>,
                hu: <>Csak egy kamera vagy mobil, és egy kéz/láb, amivel meg tudod nyomni a gombot. 😊 Teljesen kezdőként is jöhetsz, előképzettség nem szükséges.</>,
            },
        },
        {
            question: {
                en: <>How how does a course look like?</>,
                hu: <>Hogy néz ki a tanfolyam?</>,
            },
            answer: {
                en: <>We teach a new topic (e.g. ‘portrait photography’) each week. You have a week to submit your best shot.</>,
                hu: <>Hetente tanítunk egy új témát (pl. "portréfotózás"). Egy heted van beküldeni a legjobb képed.</>,
            },
        },
        {
            question: {
                en: <>Is the course completely online?</>,
                hu: <>Teljesen online a tanfolyam?</>,
            },
            answer: {
                en: <>Yes. You get the weekly challenges in email. We answer your questions in email or on the Facebook page.</>,
                hu: <>Igen. A feladatok emailben érkeznek. A kérdéseidre e-mailben/Facebookon kapsz választ.</>,
            },
        },
        {
            question: {
                en: <>Shall I come with a camera or a moble?</>,
                hu: <>Fényképezőgéppel vagy mobillal érdemes jönni?</>,
            },
            answer: {
                en: <>With a camera you can take much better shots and you can improve further, so this is what we recommend. But if you want to learn photography, don’t let the lack of a camera keep you from starting!</>,
                hu: <>Fényképezőgéppel sokkal szebb képeket fogsz csinálni és tovább fejlődhetsz, így mi ezt ajánljuk. De ha szívesen fotóznál, a fényképező hiánya ne legyen akadály.</>,
            },
        },
        {
            question: {
                en: <>Who and why does this for free?</>,
                hu: <>Kik és miért csinálják ezt ingyenesen?</>,
            },
            answer: {
                en: <>A handful of photo enthusiast Hungarians: David, Dori, Gyuri, and Luca; and a small and ever changing group of helpful mentors. Because we have jobs that we love, and we are happy to teach in our free time. 😊</>,
                hu: <>Dávid, Dóri, Gyuri, Luca és egy lelkes és folyamatosan változó kis mentor csapat. Mert van munkánk, amit szeretünk, és emellett szívesen tanítunk. 😊</>,
            },
        },
        {
            question: {
                en: <>Do I have to submit pics that I took on the challenge week?</>,
                hu: <>A beküldött képeket az adott héten kell elkészítenem?</>,
            },
            answer: {
                en: <>Yes, please only send in fresh shots. If you want to share some of your older pics with the community, feel free to submit these in the Facebook group.</>,
                hu: <>Igen, arra kérünk, hogy a legjobb heti fotódként csak friss képet küldj be. Ha szeretnéd néhány régebbi fotódat is megosztani a közösséggel, ezeket bátran küldd be a Facebook csoportba. </>,
            },
        },
        {
            question: {
                en: <>What if it’s bad weather all week, of if I can’t/don’t have time to go out?</>,
                hu: <>Mi van, ha egész héten rossz idő van, vagy nincs időm/lehetőségem elmenni fotózni?</>,
            },
            answer: {
                en: <>It happens somethimes that the circumstances are not the best for taking your imagined perfect shot. The good news is that all weekly challenges can be taken indoors, so you can take eligible pics even in case of bad weather/illness. In the worst case, you’ll need a dash of extra creativity to tailor the challenge to your situation.</>,
                hu: <>Sajnos előfordul, hogy nem a legjobbak a körülmények a tökéletes elképzeld fotódhoz. A jó hír, hogy mindegyik feladat megoldható beltérben, így rossz idő/betegség esetén is tudsz fotózni. Legfeljebb egy kis extra kreativitásra lesz szükséged, hogy a saját helyzetedre szabd a feladatot.</>,
            },
        },
        {
            question: {
                en: <>If I missed a weekly deadline, can I still continue the course?</>,
                hu: <>Ha egy hetet kihagytam, azért még folytathatom a tanfolyamot?</>,
            },
            answer: {
                en: <>Yes! All challenges are optional, only submit the ones that you like 😊 The course is about you and your progress, not about perfection. Even if you missed a weekly challenge, you can still improve a lot in the rest of the course!</>,
                hu: <>Igen. Minden feladat opcionális, azt adod be, ami tetszik. 😊 A tanfolyam rólad és a te fejlődésedről szól, nem a tökéletességről. Ha egy hétről le is csúsztál, a többi héten még rengeteget fejlődhetsz!</>,
            },
        },
        {
            question: {
                en: <>How can I join?</>,
                hu: <>Ha csatlakozni szeretnék, mit kell pontosan tennem?</>,
            },
            answer: {
                en: <>Like the Facebook page and click the ‘Sign up’ button. Signing up (and the whole course) is free.</>,
                hu: <>Lájkold az oldalt és nyomj rá a “Regisztrálok” gombra. A regisztráció (és a teljes tanfolyam) ingyenes.</>,
            },
        },
    ];
}
