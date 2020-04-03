import {createElement} from '/web_modules/react.js';
import LoadingIndicator from './LoadingIndicator.mjs';
import {useAuth0} from '../react-auth0-spa.mjs';

export default function AuthenticationArea() {
    const {loading: isLoading, isAuthenticated, user, loginWithRedirect, logout} = useAuth0();

    function handleSignIn() {
        loginWithRedirect({});
    }

    function handleSignOut() {
        logout({returnTo: window.location.origin});
    }

    const signInButton = !isLoading && !isAuthenticated && createElement('a', {href: '#', onClick: handleSignIn}, 'Sign in');
    const loadingButton = isLoading && createElement(LoadingIndicator);
    const profilePicture = user && createElement('img', {src: user.picture, alt: 'Profile picture'});
    const profileMenu = isAuthenticated && createElement('div', {className: 'menu'},
        createElement('a', {href: '#', onClick: handleSignOut}, 'Sign out'));

    return createElement('div', {className: 'authentication'},
        loadingButton,
        profilePicture,
        profileMenu,
        signInButton
    );
}