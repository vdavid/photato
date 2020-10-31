import React, {useEffect} from '../../web_modules/react.js';
import {config} from '../../config.mjs';
import {useI18n} from '../../i18n/components/I18nProvider.mjs';

export default function BugReportPage() {
    const {__, getActiveLocaleCode} = useI18n();

    useEffect(() => {document.title = __('Bug report') + ' - Photato';}, []);
    return (getActiveLocaleCode() === 'hu-HU') ? <>
        <h2>Hibajelentés</h2>
        <img src="/bug-report/images/dead-potato.jpg" alt={__('Dead potato')} />
        <p>A kurzusokat egy pár fős csapatként szervezzük. Időnként hibázunk, és ez néha neked is kellemetlenséget okozhat. Ezúton kérünk elnézést.</p>
        <p>Sokat segíthetsz azzal, hogy szólsz nekünk, amikor hibát, vagy legalábbis valami furcsaságot tapasztalsz. A hibajelentéseket a <a href={`mailto:${config.customerServiceEmailAddress}?subject=${__('Bug report')}`} target="_blank" rel="noopener">photatophotato@gmail.com</a> címre várjuk.</p>
        <p>Szokott segíteni nekünk, ha mellékeled ezeket:</p>
        <ul>
            <li>Milyen böngészőt használsz? (pl. Chrome, Firefox, Edge)</li>
            <li>Milyen rendszert használsz? (pl. Windows, Android, Mac, iPhone)</li>
            <li>Melyik oldalon tapasztaltad a hibát, és mit csináltál épp?</li>
            <li>Mi történt?</li>
            <li>Mire számítottál, mi fog történni? (Vagy: szerinted mi kellene történjen?)</li>
        </ul>
    </> : <>
        <h2>Bug report</h2>
        <img src="/bug-report/images/dead-potato.jpg" alt={__('Dead potato')} />
        <p>We’re a small group of people who organize these courses. We make mistakes, and some might negatively affect your experience. We apologize.</p>
        <p>If you found a bug, you can help us by reporting it in email at <a href={`mailto:${config.customerServiceEmailAddress}?subject=${__('Bug report')}`} target="_blank" rel="noopener">photatophotato@gmail.com</a>.</p>
        <p>It usually helps when people tell us these:</p>
        <ul>
            <li>What internet browser do you use? (e.g. Chrome, Firefox, Edge)</li>
            <li>What system do you use? (e.g. Windows, Android, Mac, iPhone)</li>
            <li>On which page did you see the problem, and what were you doing?</li>
            <li>What happened?</li>
            <li>What did you expect to happen? (Or: what do you think should happen?)</li>
        </ul>
    </>;
}