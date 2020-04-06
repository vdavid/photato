import {config} from '../../config.mjs';
import {createElement} from '/web_modules/react.js';
import {NavLink} from '/web_modules/react-router-dom.js';
import {useAuth0} from '../../auth/components/Auth0Provider.mjs';
import {useI18n} from '../../i18n/components/I18nProvider.mjs';
import {useEffect, useRef, useState} from '../../web_modules/react.js';

export default function NavigationBar() {
    const {isAuthenticated, loginWithRedirect, user, logout} = useAuth0();
    const [isMenuVisible, setIsMenuVisible] = useState(false);
    const menuRef = useRef(null);
    const {__} = useI18n();

    useEffect(() => {
        function hideMenuIfClickedOutside(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsMenuVisible(false);
            }
        }

        document.addEventListener("mousedown", hideMenuIfClickedOutside); /* Bind the event listener */
        return () => { document.removeEventListener("mousedown", hideMenuIfClickedOutside); }; /* Unbind the event listener on clean up */

    }, [menuRef]);

    function handleSignIn() {
        loginWithRedirect({});
    }

    function handleSignOut() {
        logout({returnTo: window.location.origin});
    }

    return createElement('header', {role: 'navigation'},
        createElement(NavLink, {to: '/', className: 'logo', title: 'Photato'},
            createElement('img', {src: '/app/potato-with-camera-logo.svg'}),
            createElement('div', {className: 'siteTitle'}, 'Photato'),
        ),
        createElement('nav', {ref: menuRef, className: isMenuVisible ? 'visible' : '', onClick: () => { setIsMenuVisible(false); }},
            createElement(NavLink, {to: '/', activeClassName: 'active', exact: true}, __('Home')),
            createElement(NavLink, {to: '/about', activeClassName: 'active'}, __('About')),
            isAuthenticated ? createElement(NavLink, {to: '/upload', activeClassName: 'active'}, __('Photo upload')) : null,
            (config.featureSwitches.challenges && isAuthenticated) ? createElement(NavLink, {to: '/challenges', activeClassName: 'active'}, __('Challenges')) : null,
            isAuthenticated ? createElement('hr',) : null,
            isAuthenticated ? createElement('a', {href: '#', onClick: handleSignOut}, __('Sign out')) : null,
            !isAuthenticated && createElement('a', {href: '#', onClick: handleSignIn}, __('Sign in')),
        ),
        createElement('div', {className: 'authentication', onClick: () => { setIsMenuVisible(!isMenuVisible);}},
            user && createElement('img', {src: user.picture, alt: __('Profile picture')}),
        ),
    );
}
