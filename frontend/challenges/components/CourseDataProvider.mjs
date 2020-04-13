import {createContext, createElement, useContext} from '../../web_modules/react.js';

export const CourseDataContext = createContext();

export const useCourseData = () => useContext(CourseDataContext); /* User data docs: https://auth0.com/docs/api/authentication#get-user-info */

/**
 * @param children
 * @param {CourseDateConverter} courseDateConverter
 * @returns {*}
 * @constructor
 */
export default function CourseDataProvider({children, courseDateConverter}) {
    return createElement(CourseDataContext.Provider, {
            value: {
                currentDayIndex: courseDateConverter.getDayIndexSinceCourseStart(),
                currentWeekIndex: courseDateConverter.getWeekIndex(),
                currentWeekDeadline: courseDateConverter.getWeekDeadline(),
                hasCourseStarted: courseDateConverter.hasCourseStarted(),
                isCourseOver: courseDateConverter.isCourseOver(),
                isCourseRunning: courseDateConverter.isCourseRunning(),
                getFormattedDeadline: courseDateConverter.getFormattedDeadline.bind(courseDateConverter),
            }
        }, children);
}