const config = require('../config.js');

module.exports = class PermissionHelper {
    /**
     * @param {string} emailAddress
     * @returns {boolean}
     */
    isAdmin(emailAddress) {
        return config.adminEmailAddresses.includes(emailAddress);
    }
}