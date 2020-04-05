import {createElement} from '/web_modules/react.js';
import {NavLink} from '/web_modules/react-router-dom.js';
import AuthenticationArea from './AuthenticationArea.mjs';
import {useAuth0} from '../react-auth0-spa.mjs';

export default function NavigationBar() {
    const {isAuthenticated} = useAuth0();

    return createElement('header', {role: 'navigation'},
        createElement('div', {className: 'logo', title: 'Photato'},
            createElement('img', {src: '/app/potato-logo.jpg'})),
        createElement('nav', {},
            createElement(NavLink, {to: '/', activeClassName: 'active', exact: true}, 'Home'),
            createElement(NavLink, {to: '/about', activeClassName: 'active'}, 'About'),
            isAuthenticated ? createElement(NavLink, {to: '/upload', activeClassName: 'active'}, 'Upload') : null,
            isAuthenticated ? createElement(NavLink, {to: '/challenges', activeClassName: 'active'}, 'Challenges') : null,
        ),
        createElement(AuthenticationArea),
    );
}
