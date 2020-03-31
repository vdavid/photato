import React from '/web_modules/react.js';
import {LoadingIndicator} from './LoadingIndicator.mjs';
import {useAuth0} from '../react-auth0-spa.mjs';

export const AuthenticationArea = () => {
    const {loading: isLoading, isAuthenticated, user, loginWithRedirect, logout} = useAuth0();

    function handleSignIn() {
        loginWithRedirect({});
    }

    function handleSignOut() {
        logout({returnTo: window.location.origin});
    }

    const signInButton = !isLoading && !isAuthenticated && React.createElement('a', {href: '#', onClick: handleSignIn}, 'Sign in');
    const loadingButton = isLoading && React.createElement(LoadingIndicator);
    const profilePicture = user && React.createElement('img', {src: user.picture, alt: 'Profile picture'});
    const profileMenu = isAuthenticated && React.createElement('div', {className: 'menu'},
            React.createElement('a', {href: '#', onClick: handleSignOut}, 'Sign out'));

    return React.createElement('div', {className: 'authentication'},
        loadingButton,
        profilePicture,
        profileMenu,
        signInButton
    );
};