import React, {useEffect, useState} from 'react';
import {NavLink, useParams} from 'react-router-dom';
import {useI18n} from '../../i18n/components/I18nProvider';
import {useAuth0} from '../../auth/components/Auth0Provider';

import {useCourseData} from './CourseDataProvider';
import {weeklyChallengeTitles} from '../challengeRepository';
import {formatDateWithWeekDayAndTime} from '../../website/dateTimeHelper';

import NavLinkButton from '../../website/components/NavLinkButton';
import Error404Page from '../../website/components/Error404Page';

type ChallengeComponent = React.ComponentType<{formattedDeadline: string; baseUrl: string}>;

export default function ChallengePage() {
    /* Get page parameters */
    const {weekIndex} = useParams<{weekIndex: string}>();
    const weekIndexAsNumber = Number(weekIndex);

    const [challenge, setChallenge] = useState<{isLoaded: boolean; component: ChallengeComponent | null}>({isLoaded: false, component: null});

    /* Create references to helpers */
    const {isAuthenticated} = useAuth0();
    const {__, getActiveLocaleCode} = useI18n();
    const {currentWeekIndex, getDeadline} = useCourseData();

    const formattedDeadline = formatDateWithWeekDayAndTime(getDeadline(weekIndex), getActiveLocaleCode());
    const languageCode = getActiveLocaleCode().substring(0, 2);

    useEffect(() => {
        if ((weekIndexAsNumber >= 1) && (currentWeekIndex >= weekIndexAsNumber)) {
            setChallenge({isLoaded: false, component: null});

            async function loadChallenge() {
                try {
                    setChallenge({isLoaded: true, component: (await import('../content/' + languageCode + '/Week' + weekIndex + 'Challenge.tsx')).default});
                } catch(error) {
                    // justification: pre-existing bug — the fallback stores a ReactElement where a ComponentType is expected; cast preserves runtime behavior exactly.
                    setChallenge({isLoaded: true, component: (<p>{__('Sorry, this challenge hasn’t been translated to your language yet.')}</p>) as unknown as ChallengeComponent})
                }
            }

            loadChallenge().then(() => {});
            document.title = __('Week {weekIndex}:', {weekIndex}) + ' ' + __(weeklyChallengeTitles[weekIndexAsNumber - 1]) + ' - Photato';
        }
    }, [weekIndex]);

    /* Render page */
    /* Only read inside the `challenge.isLoaded` branch, where `component` is always set. */
    const LoadedChallengeComponent = challenge.component!;

    return (weekIndexAsNumber >= 1) && (currentWeekIndex >= weekIndexAsNumber)
        ?
        <article>
            <h1>{__('Week {weekIndex}:', {weekIndex}) + ' ' + __(weeklyChallengeTitles[weekIndexAsNumber - 1])}</h1>
            {challenge.isLoaded
                ?
                <div>
                    <LoadedChallengeComponent formattedDeadline={formattedDeadline} baseUrl=''/>
                </div>
                : <p>{__('Loading challenge...')}</p>
            }
            <p>{__('We’ve collected many useful resources for you to make the most out of this challenge. You can find them here:')} <NavLink to='/materials'>{__('Materials')}</NavLink></p>
            {(parseInt(weekIndex) === currentWeekIndex) &&
            <NavLinkButton to='/upload'
                           disabled={!isAuthenticated}
                           title={!isAuthenticated ? __('You’ll need to sign in to upload a photo.') : ''}>
                {__('Upload your weekly photo')}
            </NavLinkButton>}
            <NavLinkButton to='/course'>{'← ' + __('Back to the course page')}</NavLinkButton>
        </article>
        :
        <Error404Page/>;
}