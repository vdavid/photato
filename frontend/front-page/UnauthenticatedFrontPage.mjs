import {createElement} from '/web_modules/react.js';
import {useAuth0} from '../app/react-auth0-spa.mjs';

export default function UnauthenticatedFrontPage() {
    const {loginWithRedirect} = useAuth0();

    function handleSignIn() {
        loginWithRedirect({});
    }

    return [
        createElement('h1', {}, __('Welcome to Photato!')),
        createElement('button', {onClick: handleSignIn}, __('Sign in')),
    ];
}