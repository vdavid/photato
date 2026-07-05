import CourseDateConverter from './CourseDateConverter';
import {config} from '../config';

/*
 * Course timing snapshot, computed once from the current date at module load (the old
 * CourseDataProvider computed the same values at mount). The 2020 winter course is long over, so today
 * this resolves to the stable "course complete" state — all 12 weeks visible, every deadline in the
 * past. `getDeadline` stays a live function for per-week lookups.
 */

const converter = new CourseDateConverter(config.course.startDateTime, config.course.weekCount);

export interface CourseData {
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

export const courseData: CourseData = {
    currentDayIndex: converter.getDayIndexSinceCourseStart(),
    currentWeekIndex: converter.getWeekIndex(),
    currentWeekDeadline: converter.getWeekDeadline(),
    hasCourseStarted: converter.hasCourseStarted(),
    isCourseOver: converter.isCourseOver(),
    isCourseRunning: converter.isCourseRunning(),
    courseStartDate: converter.getCourseStartDate(),
    weekCount: converter.getWeekCount(),
    getDeadline: (weekIndex) => converter.getDeadline(weekIndex),
};
