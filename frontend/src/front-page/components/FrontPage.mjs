import React from '../../web_modules/react.js';
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

    return <>
        <h1>{__('Photato') + ' – ' + __('12 weeks, 12 pics')}</h1>
        <h2>{__('Challenges')}</h2>
        <ChallengeList/>
        <div>
            <NavLinkButton to='/upload'
                           disabled={!isAuthenticated}
                           title={!isAuthenticated ? __('You’ll need to sign in to upload a photo.') : ''}>
                {__('Upload your weekly photo')}
            </NavLinkButton>
        </div>
        <div>{!isAuthenticated ?
            <button onClick={handleSignIn}>{__('Sign in')}</button> : null}</div>
    </>;
}