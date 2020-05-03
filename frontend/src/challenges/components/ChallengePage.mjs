import React, {useEffect, useState} from '../../web_modules/react.js';
import {useParams} from '../../web_modules/react-router-dom.js';
import {useI18n} from '../../i18n/components/I18nProvider.mjs';
import {useAuth0} from '../../auth/components/Auth0Provider.mjs';

import {useCourseData} from './CourseDataProvider.mjs';
import {weeklyChallengeTitles} from '../challengeRepository.mjs';

import NavLinkButton from '../../website/components/NavLinkButton.mjs';
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
    const languageCode = getActiveLocaleCode().substring(0, 2);

    useEffect(() => {
        if ((weekIndex >= 1) && (currentWeekIndex >= weekIndex)) {
            setChallenge({isLoaded: false, component: null});

            async function loadChallenge() {
                try {
                    setChallenge({isLoaded: true, component: (await import('../content/' + languageCode + '/Week' + weekIndex + 'Challenge.mjs')).default});
                } catch(error) {
                    setChallenge({isLoaded: true, component: <p>{__('Sorry, this challenge hasn’t been translated to your language yet.')}</p>})
                }
            }

            loadChallenge().then(() => {});
        }
    }, [weekIndex]);

    /* Render page */
    return (weekIndex >= 1) && (currentWeekIndex >= weekIndex)
        ?
        <article>
            <h1>{__('Week {weekIndex}:', {weekIndex}) + ' ' + __(weeklyChallengeTitles[weekIndex - 1])}</h1>
            {challenge.isLoaded
                ?
                <div>
                    <challenge.component formattedDeadline={formattedDeadline} baseUrl=''/>
                </div>
                : <p>{__('Loading challenge...')}</p>
            }
            {(parseInt(weekIndex) === currentWeekIndex) &&
            <NavLinkButton to='/upload'
                           disabled={!isAuthenticated}
                           title={!isAuthenticated ? __('You’ll need to sign in to upload a photo.') : ''}>
                {__('Upload your weekly photo')}
            </NavLinkButton>}
            <NavLinkButton to='/challenges'>{'← ' + __('Back to the challenge list')}</NavLinkButton>
        </article>
        :
        <Error404Page/>;
}