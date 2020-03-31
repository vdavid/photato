const React = window.React;
const {NavLink} = window.ReactRouterDOM;
import {AuthenticationArea} from './AuthenticationArea.mjs';
import {useAuth0} from '../react-auth0-spa.mjs';

export default function NavigationBar() {
    const {isAuthenticated} = useAuth0();

    return React.createElement('header', {role: 'navigation'},
        React.createElement('div', {className: 'logo', title: 'Photato'},
            React.createElement('img', {src: '/app/potato-logo.jpg'})),
        React.createElement('nav', {},
            React.createElement(NavLink, {to: '/', activeClassName: 'active', exact: true}, 'Home'),
            React.createElement(NavLink, {to: '/about', activeClassName: 'active'}, 'About'),
            isAuthenticated ? React.createElement(NavLink, {to: '/upload', activeClassName: 'active'}, 'Upload') : null,
        ),
        React.createElement(AuthenticationArea),
    );
}
