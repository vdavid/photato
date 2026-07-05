/**
 * E.g. "2020. május 31., vasárnap 23:59"
 *
 * @param {Date} date
 * @param {string} localeCode E.g. "en-US"
 * @returns {string}
 */
export function formatDateWithWeekDayAndTime(date, localeCode) {
    return new Intl.DateTimeFormat(localeCode, {
        year: 'numeric', month: 'long', day: 'numeric', weekday: 'long', hour: 'numeric', minute: 'numeric'
    }).format(date);
}

/**
 * E.g. "2020. május 31., vasárnap"
 *
 * @param {Date} date
 * @param {string} localeCode E.g. "en-US"
 * @returns {string}
 */
export function formatDateWithWeekDay(date, localeCode) {
    return new Intl.DateTimeFormat(localeCode, {year: 'numeric', month: 'long', day: 'numeric', weekday: 'long'})
        .format(date);
}

/**
 * @param {Date} date
 * @param {string} timeZone E.g. "America/New_York"
 * @returns {string} "YYYY-MM-DD"
 */
export function toISODateString(date, timeZone) {
    return date.toLocaleDateString('en', {timeZone: 'Europe/Budapest', year: 'numeric'})
        + '-' + date.toLocaleDateString('en', {timeZone: 'Europe/Budapest', month: '2-digit'})
        + '-' + date.toLocaleDateString('en', {timeZone: 'Europe/Budapest', day: '2-digit'});
}

/**
 * @param {Date} date
 * @param {string} timeZone E.g. "America/New_York"
 * @returns {string} "YYYY-MM-DD hh:mm"
 */
export function toISODateStringWithHHMM(date, timeZone) {
    return toISODateString(date, timeZone)
        + ' ' + date.toLocaleString('en', {timeZone: 'Europe/Budapest', hour:'2-digit', minute: '2-digit', hour12: false});
}

/**
 * @param {Date} date
 * @param {int} days
 * @return {Date}
 */
export function addDaysToDate(date, days) {
    const date2 = new Date(date.valueOf());
    date2.setDate(date2.getDate() + days);
    return date2;
}

/**
 * @param {Date} date1 Only the date part will be used (not the time)
 * @param {Date} date2 Only the date part will be used (not the time)
 * @returns {number} The difference in days (e.g. 2). Will be positive if date2 > date1
 */
export function getDifferenceInDays(date1, date2) {
    const date1WithoutTime = new Date(date1.valueOf());
    date1WithoutTime.setHours(0,0,0,0);
    const date2WithoutTime = new Date(date2.valueOf());
    date2WithoutTime.setHours(0,0,0,0);
    const diffTime = date2WithoutTime - date1WithoutTime;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}