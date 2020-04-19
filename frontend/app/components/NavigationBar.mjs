import {createElement} from '/web_modules/react.js';
import {NavLink} from '/web_modules/react-router-dom.js';
import {useAuth0} from '../../auth/components/Auth0Provider.mjs';
import {useI18n} from '../../i18n/components/I18nProvider.mjs';
import {useEffect, useRef, useState} from '../../web_modules/react.js';
import NavLinkMenuItemWithIcon from './NavLinkMenuItemWithIcon.mjs';

export default function NavigationBar() {
    const {isAuthenticated, loginWithRedirect, user, logout} = useAuth0();
    const [isMenuVisible, setIsMenuVisible] = useState(false);
    const menuRef = useRef(null);
    const authenticationMenuRef = useRef(null);
    const {__} = useI18n();

    useEffect(() => {
        function hideMenusIfClickedOutside(event) {
            if (menuRef.current && authenticationMenuRef.current
                && !menuRef.current.contains(event.target) && !authenticationMenuRef.current.contains(event.target)) {
                setIsMenuVisible(false);
            }
        }

        document.addEventListener("mousedown", hideMenusIfClickedOutside); /* Bind the event listener */
        return () => { document.removeEventListener("mousedown", hideMenusIfClickedOutside); }; /* Unbind the event listener on clean up */

    }, [menuRef, authenticationMenuRef]);

    function handleSignIn() {
        loginWithRedirect({});
    }

    function handleSignOut() {
        logout({returnTo: window.location.origin});
    }

    function createMainMenu() {
        /* List of icons: https://material.io/resources/icons/?style=baseline */
        return createElement('nav', {
                ref: menuRef, className: (isMenuVisible ? ' visible' : ''),
                onClick: () => { setIsMenuVisible(false); }
            },
            createElement(NavLinkMenuItemWithIcon, {to: '/', exact: true, activeClassName: 'active', iconName: 'home'}, __('Home')),
            createElement(NavLinkMenuItemWithIcon, {to: '/about', activeClassName: 'active', iconName: 'help'}, __('About')),
            isAuthenticated && createElement(NavLinkMenuItemWithIcon, {to: '/upload', activeClassName: 'active', iconName: 'cloud_upload'}, __('Photo upload')),
            isAuthenticated && createElement(NavLinkMenuItemWithIcon, {to: '/challenges', activeClassName: 'active', iconName: 'casino'}, __('Challenges')),
            isAuthenticated && createElement(NavLinkMenuItemWithIcon, {to: '/materials', activeClassName: 'active', iconName: 'book'}, __('Materials')),
            isAuthenticated && createElement('div', {className: 'menuItem'},
                createElement('span', {className: 'material-icons'}, ''),
                createElement('hr')),
            isAuthenticated && createElement('a', {href: '#', className: 'menuItem signOut', onClick: handleSignOut},
                createElement('span', {className: 'profile icon'},
                    createElement('img', {src: user.picture, alt: __('Profile picture'), className: 'profilePicture'})),
                createElement('span', {className: 'title'}, __('Sign out'))
            ),
        );
    }

    function createAuthenticationMenu() {
        return createElement('nav', {
                ref: authenticationMenuRef, className: 'authenticationMenu' + (isMenuVisible ? ' visible' : ''),
                onClick: () => { setIsMenuVisible(false); }
            },
            createElement('a', {href: '#', className: 'menuItem signOut', onClick: handleSignOut},
                createElement('span', {className: 'icon material-icons'}, 'exit_to_app'),
                createElement('span', {className: 'title'}, __('Sign out'))
            ),
        );
    }

    return createElement('header', {role: 'navigation'},
        createElement(NavLink, {to: '/', className: 'logo', title: 'Photato'},
            createElement('img', {src: '/app/potato-with-camera-logo.svg'}),
            createElement('div', {className: 'siteTitle'}, 'Photato'),
        ),
            createMainMenu(),
            createElement('div', {className: 'spacer'}),
            !isAuthenticated && createElement('a', {href: '#', className: 'signInLink', onClick: handleSignIn}, __('Sign in')),
            createElement('div', {className: 'material-icons hamburgerMenu', onClick: () => { setIsMenuVisible(!isMenuVisible);}}, 'menu'),
            isAuthenticated && createElement('img', {src: user.picture, alt: __('Profile picture'), onClick: () => { setIsMenuVisible(!isMenuVisible);}, className: 'profilePicture'}),
            isAuthenticated && createAuthenticationMenu(),
        );
}
