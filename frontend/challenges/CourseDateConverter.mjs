export default class CourseDateConverter {
    /**
     * @param {Date} courseStartDate 00:00 of the zeroth day of the course, a Sunday.
     * @param {int} weekCount Total number of weeks in the course
     */
    constructor(courseStartDate, weekCount) {
        this._courseStartDate = courseStartDate;
        this._weekCount = weekCount;
    }

    /**
     * @param {int|string} weekIndex A one-based index of the week. Also handles numbers given as strings, just in case.
     * @param {string} [localeCode] Default is "en-US".
     * @returns {string} A fully qualified, printable date.
     */
    getFormattedDeadline(weekIndex, localeCode = "en-US") {
        const ONE_MINUTE = 60 * 1000;
        return new Intl.DateTimeFormat(localeCode, {
            year: 'numeric', month: 'long', day: 'numeric', weekday: 'long', hour: 'numeric', minute: 'numeric'
        }).format(new Date(this.getStartDateOfWeek(parseInt(weekIndex) + 1) - ONE_MINUTE));
    }

    /**
     * @param {Date} date Usually the current date/time.
     * @returns {number} A zero-based index of the course day. Sunday is day 0, Monday is the 1st day of the course.
     */
    getDayIndexSinceCourseStart(date = new Date()) {
        const millisecondsPerDay = 1000 * 60 * 60 * 24;

        /* Discard time and time zone information. */
        const utcDate = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());

        return Math.floor((utcDate - this._courseStartDate) / millisecondsPerDay);
    }

    /**
     * @param {Date} date Usually the current date/time.
     * @returns {number} A one-based index of the course week. The week of the first Monday is the 1st week of the course.
     */
    getWeekIndex(date = new Date()) {
        const dayIndex = this.getDayIndexSinceCourseStart(date);
        return Math.floor((dayIndex - 1) / 7) + 1;
    }

    /**
     * @param {Date} date Usually the current date/time.
     * @returns {Date} A date/time when the current images should be sent in. Always a Monday 00:00.
     */
    getWeekDeadline(date = new Date()) {
        return this.getStartDateOfWeek((this.getWeekIndex(date) + 1) + 1);
    }

    /**
     * @param {int} weekIndex One-based week index
     * @return {Date}
     */
    getStartDateOfWeek(weekIndex) {
        const startDateTime = new Date(this._courseStartDate);
        startDateTime.setDate(this._courseStartDate.getDate() + 7 * (weekIndex - 1) + 1);
        return startDateTime;
    }

    hasCourseStarted(date = new Date()) {
        return this.getWeekIndex(date) >= 1;
    }

    isCourseOver(date = new Date()) {
        return this.getWeekIndex(date) > this._weekCount
    }

    isCourseRunning(date = new Date()) {
        return this.hasCourseStarted(date) && !this.isCourseOver(date);
    }
};