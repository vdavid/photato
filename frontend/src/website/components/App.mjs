import React, {useEffect, useState} from '../../web_modules/react.js';
import {BrowserRouter, Switch, Route} from '../../web_modules/react-router-dom.js';
import {useAuth0} from '../../auth/components/Auth0Provider.mjs';
import {useI18n} from '../../i18n/components/I18nProvider.mjs';

import PhotoUploader from '../../upload/PhotoUploader.mjs';

import FullPageLoadingIndicator from './FullPageLoadingIndicator.mjs';
import NavigationBar from './NavigationBar.mjs';

import Error404Page from './Error404Page.mjs';
import FrontPage from '../../front-page/components/FrontPage.mjs';
import AboutPage from '../../about/components/AboutPage.mjs';
import FaqPage from '../../faq/components/FaqPage.mjs';
import ContactPage from '../../contact/components/ContactPage.mjs';
import UploadPage from '../../upload/components/UploadPage.mjs';
import ChallengesPage from '../../challenges/components/ChallengesPage.mjs';
import ChallengePage from '../../challenges/components/ChallengePage.mjs';
import MaterialsPage from '../../materials/components/MaterialsPage.mjs';
import MaterialPage from '../../materials/components/MaterialPage.mjs';
import Footer from './Footer.mjs';
import PhotatoMessagesPage from '../../admin/messages/components/PhotatoMessagesPage.mjs';

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

    return areTranslationsLoaded && areFontsReady && !isAuthLoading
        ?
        <BrowserRouter basename='/'>
            <NavigationBar/>
            <main>
                <Switch>
                    <Route path='/' exact={true}>
                        <FrontPage/>
                    </Route>
                    <Route path='/about'>
                        <AboutPage/>
                    </Route>
                    <Route path='/faq'>
                        <FaqPage/>
                    </Route>
                    <Route path='/contact'>
                        <ContactPage/>
                    </Route>
                    <Route path='/upload'>
                        <UploadPage photoUploader={photoUploader}/>
                    </Route>
                    <Route path='/challenges' exact={true}>
                        <ChallengesPage/>
                    </Route>
                    <Route path='/challenges/:weekIndex'>
                        <ChallengePage/>
                    </Route>
                    <Route path='/materials'>
                        <MaterialsPage/>
                    </Route>
                    <Route path='/external-article/:slug'>
                        <MaterialPage/>
                    </Route>
                    <Route path='/messages'>
                        <PhotatoMessagesPage/>
                    </Route>
                    <Route path='/'>
                        <Error404Page/>
                    </Route>
                </Switch>
            </main>
            <Footer/>
        </BrowserRouter>
        :
        <FullPageLoadingIndicator/>;
}
