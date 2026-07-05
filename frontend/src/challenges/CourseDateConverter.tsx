export default class CourseDateConverter {
    private readonly _courseStartDate: Date;
    private readonly _weekCount: number;

    /**
     * @param courseStartDate 00:00 of the 1st day of the course, a Monday.
     * @param weekCount Total number of weeks in the course
     */
    constructor(courseStartDate: Date, weekCount: number) {
        this._courseStartDate = courseStartDate;
        this._weekCount = weekCount;
    }

    /**
     * @param weekIndex A one-based index of the week. Also handles numbers given as strings, just in case.
     * @returns The start of the next week, minus one minute.
     */
    getDeadline(weekIndex: number | string): Date {
        const ONE_MINUTE = 60 * 1000;
        return new Date(this.getStartDateOfWeek(parseInt(String(weekIndex)) + 1).getTime() - ONE_MINUTE);
    }

    /**
     * @param date Usually the current date/time.
     * @returns A zero-based index of the course day. Sunday is day 0, Monday is the 1st day of the course.
     */
    getDayIndexSinceCourseStart(date: Date = new Date()): number {
        const millisecondsPerDay = 1000 * 60 * 60 * 24;

        /* Discard time and time zone information. */
        const utcDate = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());

        return Math.floor((utcDate - this._courseStartDate.getTime()) / millisecondsPerDay);
    }

    /**
     * @param date Usually the current date/time.
     * @returns A one-based index of the course week. The week of the first Monday is the 1st week of the course.
     *          May return numbers that are larger than the course length. That means the course is over.
     */
    getWeekIndex(date: Date = new Date()): number {
        const dayIndex = this.getDayIndexSinceCourseStart(date);
        return Math.floor((dayIndex - 1) / 7) + 1;
    }

    /**
     * @param date Usually the current date/time.
     * @returns A date/time when the current images should be sent in. Always a Monday 00:00.
     */
    getWeekDeadline(date: Date = new Date()): Date {
        return this.getStartDateOfWeek((this.getWeekIndex(date) + 1) + 1);
    }

    /**
     * @param weekIndex One-based week index
     */
    getStartDateOfWeek(weekIndex: number): Date {
        const startDateTime = new Date(this._courseStartDate);
        startDateTime.setDate(this._courseStartDate.getDate() + 7 * (weekIndex - 1) + 1);
        return startDateTime;
    }

    hasCourseStarted(date: Date = new Date()): boolean {
        return this.getWeekIndex(date) >= 1;
    }

    isCourseOver(date: Date = new Date()): boolean {
        return this.getWeekIndex(date) > this._weekCount;
    }

    isCourseRunning(date: Date = new Date()): boolean {
        return this.hasCourseStarted(date) && !this.isCourseOver(date);
    }

    getCourseStartDate(): Date {
        return this._courseStartDate;
    }

    getWeekCount(): number {
        return this._weekCount;
    }
}
