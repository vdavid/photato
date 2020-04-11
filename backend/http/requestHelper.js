
/**
 * @param {string} queryString
 * @return {Object} The JSON result
 * @private
 */
function parseQueryString(queryString) {
    return JSON.parse(
        '{"' + queryString.replace(/&/g, '","')
        .replace(/=/g, '":"') + '"}',
        (key, value) => (key === '') ? value : decodeURIComponent(value));
}

function validateEnvironment(environmentInput) {
    const knownEnvironments = ['development', 'staging', 'production'];
    if (knownEnvironments.includes(environmentInput)) {
        return environmentInput;
    } else {
        throw new Error('Invalid environment.');
    }
}

module.exports = {
    parseQueryString,
    validateEnvironment,
}