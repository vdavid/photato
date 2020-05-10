import React, {useEffect} from '../../web_modules/react.js';
import {useAuth0} from '../../auth/components/Auth0Provider.mjs';
import {useI18n} from '../../i18n/components/I18nProvider.mjs';
import ChallengeList from '../../challenges/components/ChallengeList.mjs';
import NavLinkButton from '../../website/components/NavLinkButton.mjs';
import ExternalLink from '../../materials/components/ExternalLink.mjs';
import PotatoEmoji from '../../website/components/emojis/PotatoEmoji.mjs';
import CameraEmoji from '../../website/components/emojis/CameraEmoji.mjs';

export default function FrontPage() {
    const {isAuthenticated, loginWithRedirect} = useAuth0();
    const {__} = useI18n();

    useEffect(() => {document.title = __('12 weeks, 12 pics') + ' - Photato'}, []);

    return <>
        <h1>{__('Photato') + ' – ' + __('12 weeks, 12 pics')} <CameraEmoji /><PotatoEmoji /></h1>
        <p>Ez egy ingyenes fotós tanfolyam kezdőknek és középhaladóknak.<br/>
            Csak egy fényképezőgépre vagy mobilra van szükséged.<br/>
            A tanfolyam 12 hétig tart, minden héten új elméleti tudást és feladatot kapsz.<br/>
            Ha fotózni tanulnál, <ExternalLink href="https://bit.ly/2tB1hpR">iratkozz fel itt</ExternalLink>.
        </p>
        <h2>{__('Challenges')}</h2>
        <ChallengeList/>
        <NavLinkButton to='/upload'
                       disabled={!isAuthenticated}
                       title={!isAuthenticated ? __('You’ll need to sign in to upload a photo.') : ''}>
            {__('Upload your weekly photo')}
        </NavLinkButton>
        <div>{!isAuthenticated ?
            <button onClick={handleSignIn}>{__('Sign in')}</button> : null}</div>
    </>;

    function handleSignIn() {
        loginWithRedirect({});
    }
}