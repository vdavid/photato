// TODO: Only for Jest. It's the same as the *.js file. Once Jest supports ESM, this can be deleted.
module.exports = class CourseDateConverter {
    /**
     * @param {Date} courseStartDate
     */
    constructor(courseStartDate) {
        this._courseStartDate = courseStartDate
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
     * @returns {Date} A date/time when the current images should be sent in.
     */
    getWeekDeadline(date = new Date()) {
        const deadline = new Date(this._courseStartDate);
        deadline.setDate(this._courseStartDate.getDate() + 7 * this.getWeekIndex(date) + 1);
        return deadline;
    }
};