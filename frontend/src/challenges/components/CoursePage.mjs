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
    const currentWeekIndexButAtLeastOne = Math.max(currentWeekIndex, 1);
    const weekIndexes = Array.from(Array(Math.max(Math.min(currentWeekIndexButAtLeastOne, weekCount), 0)), (value, key) => key + 1);


    const currentWeekIndexAdjustedForFirstDay = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()).getTime() !== courseStartDate.getTime() ? currentWeekIndex : 1;

    useEffect(() => {document.title = config.course.titleWithoutPhotato + ' - Photato';}, []);

    return <>
        <h1>{config.course.titleWithPhotato}</h1>
    {currentWeekIndexAdjustedForFirstDay >= 1
        ? <>
        <p>{__('The course started {approximateWeeksAgo} ({exactDate}).', {
            approximateWeeksAgo: (currentWeekIndex > 1) ? __('about {weekIndex} weeks ago', {weekIndex: currentWeekIndex}) : __('recently'),
            exactDate: formatDateWithWeekDay(courseStartDate, getActiveLocaleCode())
        })}</p>
            {currentWeekIndex <= weekCount
                ? <>
                    {_getThisWeeksChallenge()}
                    <h2>{__('Materials')}</h2>
                    <p>{__('Make sure you read this week’s tips. Check out the materials for the current and previous weeks right here:')} <NavLink to={'/materials'}>{__('Materials')}</NavLink></p>
                    <p>
                        <NavLinkButton to='/upload'>{__('Upload your best photo')}</NavLinkButton>
                    </p>
                </>
                : _getAlreadyOverMessage()}
            {currentWeekIndex > 1 ? _getPreviousChallengesList() : null}
        </>
        : _getNotStartedMessage()}
    </>;

    function _getThisWeeksChallenge() {
        return <>
            <h2>{__('This week’s challenge')}</h2>
            <p>
                <NavLink to={'/challenges/' + currentWeekIndexAdjustedForFirstDay}>
                    {__('Week {weekIndex}:', {weekIndex: currentWeekIndexAdjustedForFirstDay}) + ' ' + __(weeklyChallengeTitles[currentWeekIndexAdjustedForFirstDay - 1])}
                </NavLink> – {__('Deadline to submit your shot')}: <strong>{formatDateWithWeekDayAndTime(getDeadline(currentWeekIndexAdjustedForFirstDay), getActiveLocaleCode())}</strong>
            </p>
        </>;
    }
    function _getPreviousChallengesList() {
        return <>
            <h2>{__('Previous challenges')}</h2>
            {weekIndexes.map(weekIndex =>
                <p>
                    <NavLink to={'/challenges/' + weekIndex}>
                        {__('Week {weekIndex}:', {weekIndex}) + ' ' + __(weeklyChallengeTitles[weekIndex - 1])}
                    </NavLink>
                </p>)}
        </>;
    }
    function _getNotStartedMessage() {
        return <>
            <p>{__('The course hasn’t started. It’ll start in only {dayCount} days, on {exactDate}!', {dayCount: Math.abs(currentDayIndex), exactDate: formatDateWithWeekDay(courseStartDate, getActiveLocaleCode())})}</p>
            <p>{__('If you’ve signed up, you’ll get an email on the next steps in {dayCount} days.', {dayCount: Math.abs(currentDayIndex)})}</p>
            <p>{__('In case you haven’t')}:</p>
            <p><ExternalLink href={config.course.signUpFormUrl} className="main callToActionButton">{__('Sign up for the next course')}</ExternalLink></p>
        </>
    }

    function _getAlreadyOverMessage() {
        return <>
            <p>{__('Unfortunately, it’s already over. But you can sign up to the next course if you still want to study photography.')}</p>
            <p>
                <ExternalLink href={config.course.signUpFormUrl} className="callToActionButton">{__('Sign up for the next course')}</ExternalLink>
            </p>
        </>;
    }
}