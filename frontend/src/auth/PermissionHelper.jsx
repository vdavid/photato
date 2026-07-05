import {config} from '../config.jsx';

export default class PermissionHelper {
    isAdmin(emailAddress) {
        return config.adminEmailAddresses.includes(emailAddress);
    }
};