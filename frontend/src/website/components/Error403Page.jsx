import React, {useEffect} from 'react';
import {useLocation} from 'react-router-dom';
import {saveUrlAndLoginWithRedirect} from '../../auth/auth0LoginHandler.jsx';
import {useAuth0} from '../../auth/components/Auth0Provider.jsx';
import {useI18n} from '../../i18n/components/I18nProvider.jsx';
import NavLinkButton from './NavLinkButton.jsx';

export default function Error403Page() {
    const {loading: isAuthLoading, isAuthenticated, loginWithRedirect} = useAuth0();
    const {__} = useI18n();
    const location = useLocation();

    useEffect(() => {document.title = __('403 error') + ' - Photato';}, []);

    return !isAuthLoading && (
        isAuthenticated ? <>
            <h1>{__('403 error')}</h1>
            <p>{__('Unfortunately, you can’t see this page.')}</p>
            <p>
                <NavLinkButton to='/'>{__('Return to the Photato main page.')}</NavLinkButton>
            </p>
        </> : <>
            <h1>{__('403 error')}</h1>
            <p>{__('This page is only for members. Log in or sign up here:')}</p>
            <p>
                <button onClick={() => saveUrlAndLoginWithRedirect(loginWithRedirect, location.pathname)}>{__('Sign in')}</button>
            </p>
            <p>
                <NavLinkButton to='/'>{__('Return to the Photato main page.')}</NavLinkButton>
            </p>
        </>);
}
