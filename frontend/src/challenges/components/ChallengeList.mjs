import React from '../../web_modules/react.js';
import {NavLink} from '../../web_modules/react-router-dom.js';
import {config} from '../../config.mjs';
import {useI18n} from '../../i18n/components/I18nProvider.mjs';
import {weeklyChallengeTitles} from '../challengeRepository.mjs';
import {useCourseData} from './CourseDataProvider.mjs';

export default function ChallengeList() {
    const {__} = useI18n();
    const {currentWeekIndex} = useCourseData();
    const weekCount = config.course.weekCount;
    const weekIndexes = Array.from(Array(Math.min(currentWeekIndex, weekCount)), (value, key) => key + 1);
    const challengeLinks = weekIndexes.map(weekIndex =>
        <li>
            <NavLink to={'/challenges/' + weekIndex}>
                {__('Week {weekIndex}:', {weekIndex}) + ' ' + __(weeklyChallengeTitles[weekIndex - 1])}
            </NavLink>
            {(weekIndex === currentWeekIndex) && (' ← ' + __('This is the current week’s challenge!'))}
        </li>);
    return <ul className='challengeList'>{challengeLinks}</ul>;
}