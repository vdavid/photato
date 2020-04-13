import {createElement, useEffect, useRef, useState} from '../../web_modules/react.js';
import {useParams} from '../../web_modules/react-router-dom.js';
import {useI18n} from '../../i18n/components/I18nProvider.mjs';
import {useHistory} from '/web_modules/react-router-dom.js';
import {useAuth0} from '../../auth/components/Auth0Provider.mjs';
import {renderReactElement} from '../../app/react-helper.js';

import {useCourseData} from './CourseDataProvider.mjs';
import {weeklyChallengeTitles} from '../challengeRepository.mjs';

import NavLinkButton from '../../app/components/NavLinkButton.mjs';

export default function ChallengePage() {
    const {weekIndex} = useParams();

    const {isAuthenticated} = useAuth0();
    const {__, getActiveLocaleCode} = useI18n();
    const history = useHistory();

    const {currentWeekIndex, getFormattedDeadline} = useCourseData();

    const [pageContentHtml, setPageContentHtml] = useState(null);
    const clickEventListenerRef = useRef((event) => {
        event.preventDefault();
        history.push('/upload');
    });

    async function fetchPageContent() {
        const response = await import('/challenges/challenge-htmls/week' + weekIndex + '.mjs');
        const html = await response.getMaterial({
            formattedDeadline: getFormattedDeadline(weekIndex, getActiveLocaleCode()),
            createPhotoUploadLink: async (label) => {
                return renderReactElement(createElement('a', {href: '/upload', className: 'uploadLink'}, label));
            }
        });
        setPageContentHtml(html);
    }

    useEffect(() => {
        setPageContentHtml(null);
        // noinspection JSIgnoredPromiseFromCall
        fetchPageContent();
    }, [weekIndex]);

    useEffect(() => {
        document.querySelectorAll('a.uploadLink').forEach(a => a.addEventListener('click', clickEventListenerRef.current));
        return (() => {
            document.querySelectorAll('a.uploadLink').forEach(a => a.removeEventListener('click', clickEventListenerRef.current));
        });
    }, [pageContentHtml]);

    return [
        createElement('h1', {}, __('Week {weekIndex}:', {weekIndex}) + ' ' + __(weeklyChallengeTitles[weekIndex - 1])),
        createElement('div', {dangerouslySetInnerHTML: {__html: pageContentHtml}},
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