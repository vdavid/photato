import {createElement} from '/web_modules/react.js';
import {useAuth0} from '../../auth/components/Auth0Provider.mjs';
import {useI18n} from '../../i18n/components/I18nProvider.mjs';
import ChallengeList from '../../challenges/components/ChallengeList.mjs';
import NavLinkButton from '../../app/components/NavLinkButton.mjs';

export default function FrontPage() {
    const {isAuthenticated, loginWithRedirect} = useAuth0();
    const {__} = useI18n();

    function handleSignIn() {
        loginWithRedirect({});
    }

    return [
        createElement('h1', {}, __('Photato') + ' – ' + __('12 weeks, 12 pics')),
        createElement('h2', {}, __('Challenges')),
        createElement(ChallengeList),
        createElement('div', {},
            createElement(NavLinkButton, {
                to: '/upload',
                className: 'actionButton',
                disabled: !isAuthenticated,
                title: !isAuthenticated ? __('You\'ll need to sign in to upload a photo.') : '',
            }, __('Upload your weekly photo')),
        ),
        createElement('div', {},
            !isAuthenticated ? createElement('button', {className: 'actionButton', onClick: handleSignIn}, __('Sign in')) : null
        ),
    ];
}