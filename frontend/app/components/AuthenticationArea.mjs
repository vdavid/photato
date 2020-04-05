import {createElement} from '/web_modules/react.js';
import LoadingIndicator from './LoadingIndicator.mjs';
import {useAuth0} from '../../auth/components/Auth0Provider.mjs';
import {useI18n} from '../../i18n/components/I18nProvider.mjs';

export default function AuthenticationArea() {
    const {loading: isLoading, isAuthenticated, user, loginWithRedirect, logout} = useAuth0();
    const {__} = useI18n();

    function handleSignIn() {
        loginWithRedirect({});
    }

    function handleSignOut() {
        logout({returnTo: window.location.origin});
    }

    const signInButton = !isLoading && !isAuthenticated && createElement('a', {href: '#', onClick: handleSignIn}, __('Sign in'));
    const loadingButton = isLoading && createElement(LoadingIndicator);
    const profilePicture = user && createElement('img', {src: user.picture, alt: __('Profile picture')});
    const profileMenu = isAuthenticated && createElement('div', {className: 'menu'},
        createElement('a', {href: '#', onClick: handleSignOut}, __('Sign out')));

    return createElement('div', {className: 'authentication'},
        loadingButton,
        profilePicture,
        profileMenu,
        signInButton
    );
}