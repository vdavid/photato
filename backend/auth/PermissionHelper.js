const config = require('../config.js');

module.exports = class PermissionHelper {
    isAdmin(emailAddress) {
        return config.adminEmailAddresses.includes(emailAddress);
    }
}