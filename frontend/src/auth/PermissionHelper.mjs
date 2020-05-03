import {config} from '../config.mjs';

export default class PermissionHelper {
    isAdmin(emailAddress) {
        return config.adminEmailAddresses.includes(emailAddress);
    }
};