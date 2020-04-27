import {createElement, useEffect, useState} from '../../web_modules/react.js';
import {BrowserRouter, Switch, Route} from '../../web_modules/react-router-dom.js';
import {useAuth0} from '../../auth/components/Auth0Provider.mjs';
import {useI18n} from '../../i18n/components/I18nProvider.mjs';

import PhotoUploader from '../../upload/PhotoUploader.mjs';

import FullPageLoadingIndicator from './FullPageLoadingIndicator.mjs';
import NavigationBar from './NavigationBar.mjs';

import Error404Page from '../../website/components/Error404Page.mjs';
import FrontPage from '../../front-page/components/FrontPage.mjs';
import AboutPage from '../../about/components/AboutPage.mjs';
import UploadPage from '../../upload/components/UploadPage.mjs';
import ChallengesPage from '../../challenges/components/ChallengesPage.mjs';
import ChallengePage from '../../challenges/components/ChallengePage.mjs';
import MaterialsPage from '../../materials/components/MaterialsPage.mjs';
import MaterialPage from '../../materials/components/MaterialPage.mjs';
import Footer from './Footer.mjs';

const photoUploader = new PhotoUploader();

export default function App() {
    const {areTranslationsLoaded} = useI18n();
    const [areFontsReady, setFontsReady] = useState(false);
    const {loading: isAuthLoading} = useAuth0();

    useEffect(() => {
        async function checkFontsLoaded() {
            // noinspection JSUnresolvedVariable (It actually exists.)
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
                    createElement(Route, {path: '/', exact: true, component: () => createElement(FrontPage)}),
                    createElement(Route, {path: '/about', component: () => createElement(AboutPage)}),
                    createElement(Route, {path: '/upload', component: () => createElement(UploadPage, {photoUploader})}),
                    createElement(Route, {path: '/challenges', exact: true, component: () => createElement(ChallengesPage)}),
                    createElement(Route, {path: '/challenges/:weekIndex', component: () => createElement(ChallengePage)}),
                    createElement(Route, {path: '/materials', component: () => createElement(MaterialsPage)}),
                    createElement(Route, {path: '/external-article/:slug', component: () => createElement(MaterialPage)}),
                    createElement(Route, {path: '/', component: () => createElement(Error404Page)}),
                ),
            ),
            createElement(Footer),
        ))
        : createElement(FullPageLoadingIndicator);
}
