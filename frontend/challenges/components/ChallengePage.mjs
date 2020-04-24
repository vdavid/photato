import {createElement, useEffect, useState} from '../../web_modules/react.js';
import {useParams} from '../../web_modules/react-router-dom.js';
import {useI18n} from '../../i18n/components/I18nProvider.mjs';
import {useAuth0} from '../../auth/components/Auth0Provider.mjs';

import {useCourseData} from './CourseDataProvider.mjs';
import {weeklyChallengeTitles} from '../challengeRepository.mjs';

import NavLinkButton from '../../app/components/NavLinkButton.mjs';
import Error404Page from '../../website/components/Error404Page.mjs';

/**
 * @typedef {Object} ChallengeData
 * @property {function(): string} getMaterial
 */

export default function ChallengePage() {
    /* Get page parameters */
    const {weekIndex} = useParams();

    const [challenge, setChallenge] = useState({isLoaded: false, component: null});

    /* Create references to helpers */
    const {isAuthenticated} = useAuth0();
    const {__, getActiveLocaleCode} = useI18n();
    const {currentWeekIndex, getFormattedDeadline} = useCourseData();

    const formattedDeadline = getFormattedDeadline(weekIndex, getActiveLocaleCode());

    useEffect(() => {
        setChallenge({isLoaded: false, component: null});

        async function loadChallenge() {
            setChallenge({isLoaded: true, component: (await import('./Week' + weekIndex + 'Challenge.mjs')).default});
        }

        loadChallenge().then(() => {});
    }, [weekIndex]);

    /* Render page */
    return (currentWeekIndex >= weekIndex)
        ? createElement('article', {},
            createElement('h1', {}, __('Week {weekIndex}:', {weekIndex}) + ' ' + __(weeklyChallengeTitles[weekIndex - 1])),
            challenge.isLoaded
                ? createElement('div', {}, createElement(challenge.component, {formattedDeadline, baseUrl: ''}))
                : __('Loading challenge...'),
            (parseInt(weekIndex) === currentWeekIndex) ? createElement(NavLinkButton, {
                to: '/upload',
                className: 'actionButton',
                disabled: !isAuthenticated,
                title: !isAuthenticated ? __('You\'ll need to sign in to upload a photo.') : '',
            }, __('Upload your weekly photo')) : null,
            createElement(NavLinkButton, {to: '/challenges', className: 'actionButton'}, '← ' + __('Back to the challenge list')),
        )
        : createElement(Error404Page);
}