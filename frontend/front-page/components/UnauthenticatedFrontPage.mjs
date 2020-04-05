import {createElement} from '/web_modules/react.js';
import {useAuth0} from '../../auth/components/Auth0Provider.mjs';
import {useI18n} from '../../i18n/components/I18nProvider.mjs';

export default function UnauthenticatedFrontPage() {
    const {loginWithRedirect} = useAuth0();
    const {__} = useI18n();

    function handleSignIn() {
        loginWithRedirect({});
    }

    return [
        createElement('h1', {}, __('Welcome to Photato!')),
        createElement('button', {onClick: handleSignIn}, __('Sign in')),
    ];
}