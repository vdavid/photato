import React, {useEffect} from '../../web_modules/react.js';
import {useI18n} from '../../i18n/components/I18nProvider.mjs';
import NavLinkButton from './NavLinkButton.mjs';
import {useAuth0} from '../../auth/components/Auth0Provider.mjs';

export default function Error403Page() {
    const {loading: isAuthLoading, isAuthenticated, loginWithRedirect} = useAuth0();
    const {__} = useI18n();

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
                <button onClick={() => loginWithRedirect({})}>{__('Sign in')}</button>
            </p>
            <p>
                <NavLinkButton to='/'>{__('Return to the Photato main page.')}</NavLinkButton>
            </p>
        </>);
}
