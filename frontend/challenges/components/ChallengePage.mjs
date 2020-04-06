import {createElement, useEffect, useState} from '../../web_modules/react.js';
import {useParams} from '../../web_modules/react-router-dom.js';
import {useI18n} from '../../i18n/components/I18nProvider.mjs';
import {weeklyChallengeTitles} from '../challengeRepository.mjs';
import NavLinkButton from '../../app/components/NavLinkButton.mjs';
import {useCourseData} from './CourseDataProvider.mjs';
import {useAuth0} from '../../auth/components/Auth0Provider.mjs';

export default function ChallengePage() {
    const {weekIndex} = useParams();

    const {isAuthenticated} = useAuth0();
    const {__} = useI18n();
    const {currentWeekIndex} = useCourseData();

    const [pageContentHtml, setPageContentHtml] = useState(null);

    async function fetchPageContent() {
        const response = await fetch('/challenges/challenge-htmls/week' + weekIndex + '.html', {mode: 'no-cors'});
        const html = await response.text();
        setPageContentHtml(html);
    }

    useEffect(() => {
        setPageContentHtml(null);
        // noinspection JSIgnoredPromiseFromCall
        fetchPageContent();
    }, [weekIndex]);

    return [
        createElement('h1', {}, __('Week {weekIndex}:', {weekIndex}) + ' ' + __(weeklyChallengeTitles[weekIndex - 1])),
        createElement('div', {dangerouslySetInnerHTML: {__html: pageContentHtml}}),
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