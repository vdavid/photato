import {config} from '../config';

export default class PermissionHelper {
    isAdmin(emailAddress: string | undefined): boolean {
        return emailAddress !== undefined && config.adminEmailAddresses.includes(emailAddress);
    }
}