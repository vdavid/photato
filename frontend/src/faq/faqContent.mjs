import React from '../web_modules/react.js';
import {NavLink} from '../web_modules/react-router-dom.js';
import ExternalLink from '../materials/components/ExternalLink.mjs';

/**
 * @param languageCode
 * @returns {{question: *, answer: *, id: string}[]}
 */
export function getSingleLanguageContent(languageCode) {
    return getMultiLanguageContent().map(questionAndAnswer => ({
        id: questionAndAnswer.id,
        question: questionAndAnswer.question[languageCode],
        answer: questionAndAnswer.answer[languageCode]
    }));
}

/**
 * @returns {({id: string, question: {en: Component, hu: Component}, answer: {en: Component, hu: Component}})[]}
 */
function getMultiLanguageContent() {
    return [
        {
            id: 'faq-what-is-photato',
            question: {
                en: <>What’s Photato?</>,
                hu: <>Mi az a Photato?</>,
            },
            answer: {
                en: <>It’s a 12-week, free, online photo course. <NavLink to={'/about'}>Read more about it here</NavLink>.</>,
                hu: <>Egy 12 hetes, ingyenes, online fotós tanfolyam. <NavLink to={'/about'}>További infók rólunk itt</NavLink>.</>,
            },
        },
        {
            id: 'faq-free',
            question: {
                en: <>Is it really free?</>,
                hu: <>Tényleg ingyenes?</>,
            },
            answer: {
                en: <>Yes.</>,
                hu: <>Igen.</>,
            },
        },
        {
            id: 'faq-online',
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
            id: 'faq-prerequisites',
            question: {
                en: <>What are the prerequisites to join?</>,
                hu: <>Mik a követelmények a csatlakozáshoz?</>,
            },
            answer: {
                en: <>Only a camera or mobile phone, and a hand/foot to press the shutter. 😊 You can come as a complete beginner, no previous experience is needed.</>,
                hu: <>Csak egy kamera vagy mobil, és egy kéz/láb, amivel meg tudod nyomni a gombot. 😊 Teljesen kezdőként is jöhetsz, előképzettség nem szükséges.</>,
            },
        },
        {
            id: 'faq-structure',
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
            id: 'faq-mobile',
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
            id: 'faq-film',
            question: {
                en: <>Can I come with a film camera?</>,
                hu: <>Jöhetek filmes géppel is?</>,
            },
            answer: {
                en: <>You can. If you’re a beginner, we recommend digital because you can instantly see your pics and learn from them, plus you’re more likely to shoot many pics and learn by trial and error. But if you decide so, you can totally join the course with a film camera.</>,
                hu: <>Igen. Ha kezdő vagy, digitális gépet javaslunk, mert így azonnal meg tudod nézni a képeig és tanulni belőlük. Ezen kívül, digitális géppel valószínűleg több képet fogsz lőni és így próbálkozva, gyakorolva tanulni. De ha úgy döntesz, abszolút csatlakozhatsz filmes géppel is.</>,
            },
        },
        {
            id: 'faq-pro',
            question: {
                en: <>I’m an intermediate/pro photographer, can I join?</>,
                hu: <>Középhaladó/profi fotós vagyok, jöhetek?</>,
            },
            answer: {
                en: <>If you’ve already got the basics (aperture, shutter speed, ISO, depth of field, etc.), we still recommend Photato. For you, the weekly topics, ideas, alternative versions, pro tips might be exciting. In case you’re an even more professional photographer, then we suggest 2 things:
                    <ol>
                        <li>Join as a mentor. You can hone your skills by commenting on the shots of others.</li>
                        <li>Recommend Photato to your friends and family, and help them during their course if they have questions.</li>
                    </ol>
                </>,
                hu: <>Ha a fotózási alapok (blende, záridő, ISO érték, mélységélesség, stb.) már megvannak, akkor is ajánljuk a Photatot. Neked inkább a heti témák, az ötletek, alternatív változatok, haladóbb tippek lehetnek izgalmasabbak. Ha még profibb fotós vagy, akkor két dolgot ajánlunk:
                    <ol>
                        <li>Csatlakozz mentorként. A többiek fotóit véleményezve még csomót tanulhatsz.</li>
                        <li>Ajánld a Photatot a barátaidnak, családtagjaiknak, és segíts nekik a tanfolyam során, ha kérdéseik vannak.</li>
                    </ol>
                </>,
            },
        },
        {
            id: 'faq-fresh-pics',
            question: {
                en: <>Can I submit pics I took before the challenge week?</>,
                hu: <>A beküldött képet az adott héten kell elkészítenem?</>,
            },
            answer: {
                en: <>Please only send in fresh shots. If you want to share some of your older pics with the community, feel free to submit these in the Facebook group.</>,
                hu: <>Igen, arra kérünk, hogy a legjobb heti fotódként csak friss képet küldj be. Ha szeretnéd néhány régebbi fotódat is megosztani a közösséggel, ezeket bátran küldd be a Facebook csoportba. </>,
            },
        },
        {
            id: 'faq-coronavirus',
            question: {
                en: <>What if it’s bad weather all week, of if I can’t/don’t have time to go out?</>,
                hu: <>Mi van rossz idő esetén, vagy ha nincs időm kimenni fotózni?</>,
            },
            answer: {
                en: <>It happens somethimes that the circumstances are not the best for taking your imagined perfect shot. The good news is that all weekly challenges can be taken indoors, so you can take eligible pics even in case of bad weather/illness. In the worst case, you’ll need a dash of extra creativity to tailor the challenge to your situation.</>,
                hu: <>Sajnos előfordul, hogy nem a legjobbak a körülmények a tökéletes elképzeld fotódhoz. A jó hír, hogy mindegyik feladat megoldható beltérben, így rossz idő/betegség esetén is tudsz fotózni. Legfeljebb egy kis extra kreativitásra lesz szükséged, hogy a saját helyzetedre szabd a feladatot.</>,
            },
        },
        {
            id: 'faq-missed-weeks',
            question: {
                en: <>I missed a weekly deadline. Can I continue the course?</>,
                hu: <>Egy hetet kihagytam. Folytathatom a tanfolyamot?</>,
            },
            answer: {
                en: <>Yes! All challenges are optional, only submit the ones that you like 😊 The course is about you and your progress, not about perfection. Even if you missed a weekly challenge, you can still improve a lot in the rest of the course!</>,
                hu: <>Igen. Minden feladat opcionális, azt adod be, ami tetszik. 😊 A tanfolyam rólad és a te fejlődésedről szól, nem a tökéletességről. Ha egy hétről le is csúsztál, a többi héten még rengeteget fejlődhetsz!</>,
            },
        },
        {
            id: 'faq-how-to-join',
            question: {
                en: <>How can I join?</>,
                hu: <>Csatlakozni szeretnék. Mit tegyek?</>,
            },
            answer: {
                en: <><ExternalLink href="https://bit.ly/3iDJ3HV">Sign up here</ExternalLink>. Signing up (and the whole course) is free.</>,
                hu: <><ExternalLink href="https://bit.ly/3iDJ3HV">Iratkozz fel itt</ExternalLink>. A regisztráció (és a teljes tanfolyam) ingyenes.</>,
            },
        },
        {
            id: 'faq-who',
            question: {
                en: <>Who and why does this for free?</>,
                hu: <>Kik és miért csinálják ezt ingyenesen?</>,
            },
            answer: {
                en: <>A handful of photo enthusiast Hungarians: David, Dori, Gyuri, and Luca; and a small and ever changing group of helpful mentors. Because we have jobs that we love, and we are happy to teach in our free time. 😊 More about us on the <NavLink to={'/about'}>about</NavLink> page.</>,
                hu: <>Dávid, Dóri, Gyuri, Luca és egy lelkes és folyamatosan változó kis mentor csapat. Mert van munkánk, amit szeretünk, és emellett szívesen tanítunk. 😊 Bővebben a <NavLink to={'/about'}>rólunk</NavLink> oldalon.</>,
            },
        },
        {
            id: 'faq-questions',
            question: {
                en: <>I have more questions, where can I ask?</>,
                hu: <>Ha más kérdésem van, hol tehetem fel?</>,
            },
            answer: {
                en: <>Go to our <NavLink to={'/contact'}>Contact page</NavLink> for our email address and more.</>,
                hu: <>A <NavLink to={'/contact'}>Kapcsolat</NavLink> oldalunkon megtalálod az e-mail címüket.</>,
            },
        },
        {
            id: 'faq-how-to-help',
            question: {
                en: <>I like Photato, how can I help you guys?</>,
                hu: <>Tetszik a Photato, hogyan tudok segíteni nektek?</>,
            },
            answer: {
                en: <>Several ways:
                    <ul>
                        <li>If you know basic photography, join us as a mentor. (You don’t need to be a pro, just be willing to be kind to people and give feedback.) Apply in a short email here: <a href="mailto:photatophotato@gmail.com?subject=Interested in helping with my feedback">photatophotato@gmail.com</a>.
                        </li>
                        <li>If you know some web development or graphics design, you can help with the website. <NavLink to={'/contact'}>Contact us</NavLink>.
                        </li>
                        <li>You can donate money. For a few bucks we can attract dozens of people and teach them photography. <NavLink to={'/contact'}>Contact us</NavLink>.
                        </li>
                        <li>You can just join the course and start studying. If you do that we’ve already reached our goal. 😊</li>
                    </ul>
                </>,
                hu: <>Többféleképp is:
                    <ul>
                        <li>Ha megvannak a fotózás alapjai, csatlakozz mentorként. (Nem kell profinak lenned. Ha tudsz kedves visszajelzéseket írni az embereknek, az elég.) Jelentkezz egy rövid e-mailben itt: <a href="mailto:photatophotato@gmail.com?subject=Visszajelzésekkel segítenék">photatophotato@gmail.com</a>.
                        </li>
                        <li>Ha értesz a webfejlesztéshez vagy –designhoz, tudsz segíteni a honlappal. <NavLink to={'/contact'}>Kontakt</NavLink>.
                        </li>
                        <li>Tudsz nekünk adakozni. Ezer forintból több tucat új diákot tudunk szerezni és fotózni tanítani őket. Ha érdekel, keress minket az <NavLink to={'/contact'}>elérhetőségeinken</NavLink>.
                        </li>
                        <li>Egyszerűen csak csatlakozz a következő tanfolyamhoz, és tanulj fotózni. Ha ezt megteszed, mi már elértük a célunkat. 😊</li>
                    </ul>
                </>,
            },
        },
    ];
}
