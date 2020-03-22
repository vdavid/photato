export default class CourseDateConverter {
    /**
     * @param {Date} courseStartDate
     */
    constructor(courseStartDate) {
        this._courseStartDate = courseStartDate
    }

    /**
     * @param {Date} date Usually the current date/time.
     * @returns {number} A zero-based index of the course day
     */
    getDayIndexSinceCourseStart(date = new Date()) {
        const millisecondsPerDay = 1000 * 60 * 60 * 24;

        /* Discard time and time zone information. */
        const utcDate = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());

        return Math.floor((utcDate - this._courseStartDate) / millisecondsPerDay);
    }

    /**
     * @param {Date} date Usually the current date/time.
     * @returns {number} A zero-based index of the course week
     */
    getWeekIndex(date = new Date()) {
        const dayIndex = this.getDayIndexSinceCourseStart(date);
        return Math.floor(dayIndex / 7);
    }

    /**
     * @param {Date} date Usually the current date/time.
     * @returns {Date} A date/time when the current images should be sent in.
     */
    getWeekDeadline(date = new Date()) {
        const deadline = new Date(this._courseStartDate);
        deadline.setDate(this._courseStartDate.getDate() + 7 * this.getWeekIndex(date) + 1);
        return deadline;
    }
}