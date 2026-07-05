import React from 'react';
import {NavLink} from 'react-router-dom';
import {config} from '../../config';
import {useI18n} from '../../i18n/components/I18nProvider';
import {weeklyChallengeTitles} from '../challengeRepository';
import {useCourseData} from './CourseDataProvider';

export default function ChallengeList() {
    const {__} = useI18n();
    const {currentWeekIndex} = useCourseData();
    const weekCount = config.course.weekCount;
    const weekIndexes = Array.from(Array(Math.min(currentWeekIndex, weekCount)), (value, key) => key + 1);
    const challengeLinks = weekIndexes.map(weekIndex =>
        <p>
            <NavLink to={'/challenges/' + weekIndex}>
                {__('Week {weekIndex}:', {weekIndex}) + ' ' + __(weeklyChallengeTitles[weekIndex - 1])}
            </NavLink>
        </p>);
    return <div className='challengeList'>{challengeLinks}</div>;
}