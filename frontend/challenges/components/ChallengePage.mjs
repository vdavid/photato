import {createElement, useEffect, useState} from '../../web_modules/react.js';
import {useParams} from '../../web_modules/react-router-dom.js';
import {useI18n} from '../../i18n/components/I18nProvider.mjs';
import {weeklyChallengeTitles} from '../challengeRepository.mjs';
import NavLinkButton from '../../app/components/NavLinkButton.mjs';
import {useCourseData} from './CourseDataProvider.mjs';
import {useAuth0} from '../../auth/components/Auth0Provider.mjs';
import JsxParser from '../../web_modules/react-jsx-parser.js';

export default function ChallengePage() {
    const {weekIndex} = useParams();

    const {isAuthenticated} = useAuth0();
    const {__, getActiveLocaleCode} = useI18n();
    const {currentWeekIndex, getFormattedDeadline} = useCourseData();

    const [pageContent, setPageContent] = useState(null);

    async function fetchPageContent() {
        const response = await fetch('/challenges/challenge-htmls/week' + weekIndex + '.jsx', {mode: 'no-cors'});
        const html = await response.text();
        setPageContent(html);
    }

    useEffect(() => {
        setPageContent(null);
        // noinspection JSIgnoredPromiseFromCall
        fetchPageContent();
    }, [weekIndex]);

    return [
        createElement('h1', {}, __('Week {weekIndex}:', {weekIndex}) + ' ' + __(weeklyChallengeTitles[weekIndex - 1])),
        createElement(JsxParser, {bindings: {
                formattedDeadline: getFormattedDeadline(weekIndex, getActiveLocaleCode()),
            },
            components: {},
            jsx: pageContent,
        }),
        createElement('div',  {},
        (parseInt(weekIndex) === currentWeekIndex) ? createElement(NavLinkButton, {
            to: '/upload',
            className: 'actionButton',
            disabled: !isAuthenticated,
            title: !isAuthenticated ? __('You\'ll need to sign in to upload a photo.') : '',
        }, __('Upload your weekly photo')) : null,
        ),
        createElement(NavLinkButton, {to: '/challenges', className: 'actionButton'}, '← ' + __('Back to the challenge list')),
    ];
}