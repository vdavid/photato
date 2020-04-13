import {createElement, useEffect, useRef, useState} from '../../web_modules/react.js';
import {useParams} from '../../web_modules/react-router-dom.js';
import {useI18n} from '../../i18n/components/I18nProvider.mjs';
import {useHistory} from '/web_modules/react-router-dom.js';
import {useAuth0} from '../../auth/components/Auth0Provider.mjs';

import {useCourseData} from './CourseDataProvider.mjs';
import {weeklyChallengeTitles} from '../challengeRepository.mjs';

import NavLinkButton from '../../app/components/NavLinkButton.mjs';

export default function ChallengePage() {
    /* Get page parameters */
    const {weekIndex} = useParams();

    /* Create references to helpers */
    const {isAuthenticated} = useAuth0();
    const {__, getActiveLocaleCode} = useI18n();
    const {currentWeekIndex, getFormattedDeadline} = useCourseData();

    /* Set up state */
    const [pageContentHtml, setPageContentHtml] = useState(null);

    /* Fetch page content asynchronously when the week index changes */
    async function fetchPageContent() {
        const response = await import('../challenge-texts/week' + weekIndex + '.mjs');
        const html = await response.getMaterial({
            baseUrl: '',
            formattedDeadline: getFormattedDeadline(weekIndex, getActiveLocaleCode()),
            createPhotoUploadLink: label => `<a href="/upload" class="uploadLink">${label}</a>`,
            createFullWidthLocalImage: (fileName, altText) => `<img src="/challenges/illustrations/${fileName}" alt="${altText}" style="width:100%;" />`,
        });
        setPageContentHtml(html);
    }

    useEffect(() => {
        setPageContentHtml(null);
        // noinspection JSIgnoredPromiseFromCall
        fetchPageContent();
    }, [weekIndex]);

    /* Set upload links to dynamic (in-React, no page refresh) links at each page content change */
    const history = useHistory();
    const clickEventListenerRef = useRef((event) => {
        event.preventDefault();
        history.push('/upload');
    });
    useEffect(() => {
        document.querySelectorAll('a.uploadLink').forEach(a => a.addEventListener('click', clickEventListenerRef.current));
        return (() => {
            document.querySelectorAll('a.uploadLink').forEach(a => a.removeEventListener('click', clickEventListenerRef.current));
        });
    }, [pageContentHtml]);

    /* Render page */
    return [
        createElement('h1', {}, __('Week {weekIndex}:', {weekIndex}) + ' ' + __(weeklyChallengeTitles[weekIndex - 1])),
        createElement('div', {dangerouslySetInnerHTML: {__html: pageContentHtml}}),
        (parseInt(weekIndex) === currentWeekIndex) ? createElement(NavLinkButton, {
            to: '/upload',
            className: 'actionButton',
            disabled: !isAuthenticated,
            title: !isAuthenticated ? __('You\'ll need to sign in to upload a photo.') : '',
        }, __('Upload your weekly photo')) : null,
        createElement(NavLinkButton, {to: '/challenges', className: 'actionButton'}, '← ' + __('Back to the challenge list')),
    ];
}