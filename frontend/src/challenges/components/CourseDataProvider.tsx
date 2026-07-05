import React, {createContext, useContext} from 'react';
import type CourseDateConverter from '../CourseDateConverter';

export interface CourseDataContextValue {
    currentDayIndex: number;
    /** One-based! */
    currentWeekIndex: number;
    currentWeekDeadline: Date;
    hasCourseStarted: boolean;
    isCourseOver: boolean;
    isCourseRunning: boolean;
    courseStartDate: Date;
    weekCount: number;
    getDeadline: (weekIndex: number | string) => Date;
}

export const CourseDataContext = createContext<CourseDataContextValue>(undefined as unknown as CourseDataContextValue);

export const useCourseData = (): CourseDataContextValue => useContext(CourseDataContext);

interface CourseDataProviderProps {
    children: React.ReactNode;
    courseDateConverter: CourseDateConverter;
}

export default function CourseDataProvider({children, courseDateConverter}: CourseDataProviderProps) {
    return <CourseDataContext.Provider value={{
        currentDayIndex: courseDateConverter.getDayIndexSinceCourseStart(),
        currentWeekIndex: courseDateConverter.getWeekIndex(), /* One-based! */
        currentWeekDeadline: courseDateConverter.getWeekDeadline(),
        hasCourseStarted: courseDateConverter.hasCourseStarted(),
        isCourseOver: courseDateConverter.isCourseOver(),
        isCourseRunning: courseDateConverter.isCourseRunning(),
        courseStartDate: courseDateConverter.getCourseStartDate(),
        weekCount: courseDateConverter.getWeekCount(),
        getDeadline: courseDateConverter.getDeadline.bind(courseDateConverter),
    }}>{children}</CourseDataContext.Provider>;
}
