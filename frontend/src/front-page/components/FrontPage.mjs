import React, {useEffect} from '../../web_modules/react.js';
import {useAuth0} from '../../auth/components/Auth0Provider.mjs';
import {useI18n} from '../../i18n/components/I18nProvider.mjs';
import ChallengeList from '../../challenges/components/ChallengeList.mjs';
import NavLinkButton from '../../website/components/NavLinkButton.mjs';
import ExternalLink from '../../materials/components/ExternalLink.mjs';

export default function FrontPage() {
    const {isAuthenticated, loginWithRedirect} = useAuth0();
    const {__} = useI18n();

    useEffect(() => {document.title = __('12 weeks, 12 pics') + ' - Photato';}, []);

    return <>
        <div className="lead">
            <div className="leadImage" style={{backgroundImage: 'url("/front-page/1600x400px-24x8-photo-mosaic-turned-blurred.jpg")'}} />
            <div className="leadImageGradient" />
            <div className="leadText">
                <div>
                    <h1>{__('Photato') + ' – ' + __('12 weeks, 12 pics')}</h1>
                    <p>Ez egy ingyenes fotós tanfolyam kezdőknek és középhaladóknak.<br/>
                        Csak egy fényképezőgépre vagy mobilra van szükséged.<br/>
                        A tanfolyam 12 hétig tart, minden héten új elméleti tudást és feladatot kapsz.<br/>
                        Ha fotózni tanulnál:
                    </p>
                    <ExternalLink href="https://bit.ly/2tB1hpR" className="callToActionButton">Iratkozz fel itt!</ExternalLink>
                </div>
            </div>
        </div>
        <h2>{__('Challenges')}</h2>
        <ChallengeList/>
        <div>
            <p>
                <NavLinkButton to='/upload'
                               disabled={!isAuthenticated}
                               title={!isAuthenticated ? __('You’ll need to sign in to upload a photo.') : ''}>
                    {__('Upload your weekly photo')}
                </NavLinkButton>
            </p>
            {!isAuthenticated ?
                <p>
                    <button onClick={handleSignIn}>{__('Sign in')}</button>
                </p> : null}
        </div>
    </>;

    function handleSignIn() {
        loginWithRedirect({});
    }
}