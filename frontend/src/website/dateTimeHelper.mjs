export function formatDateWithWeekDayAndTime(date, localeCode) {
    return new Intl.DateTimeFormat(localeCode, {
        year: 'numeric', month: 'long', day: 'numeric', weekday: 'long', hour: 'numeric', minute: 'numeric'
    }).format(date);
}

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