import {createElement, useEffect, useState} from '../../web_modules/react.js';
import {BrowserRouter, Switch, Route, Redirect} from '/web_modules/react-router-dom.js';
import {useI18n} from '../../i18n/components/I18nProvider.mjs';

import PhotoUploader from '../../upload/PhotoUploader.mjs';

import FullPageLoadingIndicator from './FullPageLoadingIndicator.mjs';
import NavigationBar from './NavigationBar.mjs';

import FrontPage from '../../front-page/components/FrontPage.mjs';
import AboutPage from '../../about/AboutPage.mjs';
import UploadPage from '../../upload/components/UploadPage.mjs';
import ChallengesPage from '../../challenges/components/ChallengesPage.mjs';
import ChallengePage from '../../challenges/components/ChallengePage.mjs';
import {useAuth0} from '../../auth/components/Auth0Provider.mjs';

const photoUploader = new PhotoUploader();

export default function App() {
    const {areTranslationsLoaded, __} = useI18n();
    const [areFontsReady, setFontsReady] = useState(false);
    const {loading: isAuthLoading} = useAuth0();

    useEffect(() => {
        async function checkFontsLoaded() {
            await document.fonts.ready;
            setFontsReady(true);
        }

        // noinspection JSIgnoredPromiseFromCall
        checkFontsLoaded();
    }, []);

    return (areTranslationsLoaded && areFontsReady && !isAuthLoading)
        ? (createElement(BrowserRouter, {basename: '/'},
        createElement(NavigationBar),
        createElement('main', null,
            createElement(Switch, null,
                createElement(Route, {path: '/about', component: () => createElement(AboutPage)}),
                createElement(Route, {path: '/upload', component: () => createElement(UploadPage, {photoUploader})}),
                createElement(Route, {path: '/challenges/:weekIndex', component: () => createElement(ChallengePage)}),
                createElement(Route, {path: '/challenges', component: () => createElement(ChallengesPage)}),
                createElement(Route, {path: '/', component: () => createElement(FrontPage)}),
                createElement(Redirect, {path: '*', to: {...window.history, pathname: '/'}}),
            ),
        ),
        createElement('footer', null, createElement('span', {className: 'copyright'}, __('Made with ❤️ by the Photato team'))),
    ))
        : createElement(FullPageLoadingIndicator);
}
