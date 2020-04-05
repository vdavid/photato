import {createElement} from '/web_modules/react.js';
import {useAuth0} from '../../auth/components/Auth0Provider.mjs';
import {useI18n} from '../../i18n/components/I18nProvider.mjs';
import {NavLink} from '../../web_modules/react-router-dom.js';

export default function AuthenticatedFrontPage() {
    const {__} = useI18n();
    const {user} = useAuth0();

    return [
        createElement('h1', {}, __('Welcome to Photato, {firstName}!', {firstName: user.given_name})),
        createElement(NavLink, {to: '/upload', activeClassName: 'active'}, __('Upload your weekly photo here')),
    ];
}