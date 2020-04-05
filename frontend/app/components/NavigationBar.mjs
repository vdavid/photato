import {config} from '../../config.mjs';
import {createElement} from '/web_modules/react.js';
import {NavLink} from '/web_modules/react-router-dom.js';
import AuthenticationArea from './AuthenticationArea.mjs';
import {useAuth0} from '../../auth/components/Auth0Provider.mjs';
import {useI18n} from '../../i18n/components/I18nProvider.mjs';

export default function NavigationBar() {
    const {isAuthenticated} = useAuth0();
    const {__} = useI18n();

    return createElement('header', {role: 'navigation'},
        createElement('div', {className: 'logo', title: 'Photato'},
            createElement('img', {src: '/app/potato-with-camera-logo.svg'})),
        createElement('nav', {},
            createElement(NavLink, {to: '/', activeClassName: 'active', exact: true}, __('Home')),
            createElement(NavLink, {to: '/about', activeClassName: 'active'}, __('About')),
            isAuthenticated ? createElement(NavLink, {to: '/upload', activeClassName: 'active'}, __('Photo upload')) : null,
            (config.featureSwitches.challenges && isAuthenticated) ? createElement(NavLink, {to: '/challenges', activeClassName: 'active'}, __('Challenges')) : null,
        ),
        createElement(AuthenticationArea),
    );
}
