import React, {useEffect} from '../../web_modules/react.js';
import {useI18n} from '../../i18n/components/I18nProvider.mjs';
import {config} from '../../config.mjs';
import {weeklyChallengeTitles} from '../challengeRepository.mjs';
import {useCourseData} from './CourseDataProvider.mjs';
import {NavLink} from '../../web_modules/react-router-dom.js';
import NavLinkButton from '../../website/components/NavLinkButton.mjs';
import {formatDateWithWeekDay, formatDateWithWeekDayAndTime} from '../../website/dateTimeHelper.mjs';
import ExternalLink from '../../materials/components/ExternalLink.mjs';

export default function CoursePage() {
    const {__, getActiveLocaleCode} = useI18n();
    const {currentWeekIndex, currentDayIndex, weekCount, courseStartDate, getDeadline} = useCourseData();
    const weekIndexes = Array.from(Array(Math.max(Math.min(currentWeekIndex, weekCount), 0)), (value, key) => key + 1);

    useEffect(() => {document.title = config.course.titleWithoutPhotato + ' - Photato';}, []);

    if (currentWeekIndex >= 1) {
        return <>
            <h1>{config.course.titleWithPhotato}</h1>
            <p>{__('The course started {approximateWeeksAgo} ({exactDate}).', {
                approximateWeeksAgo: (currentWeekIndex > 1) ? __('about {weekIndex} weeks ago', {weekIndex: currentWeekIndex}) : __('recently'),
                exactDate: formatDateWithWeekDay(courseStartDate, getActiveLocaleCode())
            })}</p>
            {currentWeekIndex <= weekCount ?
                <>
                    <h2>{__('This week’s challenge')}</h2>
                    <p>
                        <NavLink to={'/challenges/' + currentWeekIndex}>
                            {__('Week {weekIndex}:', {weekIndex: currentWeekIndex}) + ' ' + __(weeklyChallengeTitles[currentWeekIndex - 1])}
                        </NavLink> – {__('Deadline to submit your shot')}: {formatDateWithWeekDayAndTime(getDeadline(currentWeekIndex), getActiveLocaleCode())}
                    </p>
                    <p>
                        <NavLinkButton to='/upload'>{__('Upload your best photo')}</NavLinkButton>
                    </p>
                </> :
                <>
                    <p>{__('Unfortunately, it’s already over. But you can sign up to the next course if you still want to study photography.')}</p>
                    <p>
                        <ExternalLink href={config.course.signUpFormUrl} className="callToActionButton">{__('Sign up for the next course')}</ExternalLink>
                    </p>
                </>}
            {currentWeekIndex > 1 ?
                <>
                    <h2>{__('Previous challenges')}</h2>
                    {weekIndexes.map(weekIndex =>
                        <p>
                            <NavLink to={'/challenges/' + weekIndex}>
                                {__('Week {weekIndex}:', {weekIndex}) + ' ' + __(weeklyChallengeTitles[weekIndex - 1])}
                            </NavLink>
                        </p>)}
                </>
                : null}
        </>;
    } else {
        return <>
            <p>{__('The course hasn’t started. It’ll start in only {dayCount} days!', {dayCount: Math.abs(currentDayIndex)})}</p>
            <p>{__('If you’ve signed up, you’ll get an email on the next steps in {dayCount} days.', {dayCount: Math.abs(currentDayIndex)})}</p>
            <p>{__('In case you haven’t')}:</p>
            <p><ExternalLink href={config.course.signUpFormUrl} className="main callToActionButton">{__('Sign up for the next course')}</ExternalLink></p>
            </>
    }
}