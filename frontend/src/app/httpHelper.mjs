/**
 * @param {object} object
 * @returns {string}
 * @private
 */
export function convertObjectToQueryString(object) {
    return Object.keys(object).map(key => key + '=' + object[key]).join('&');
}
