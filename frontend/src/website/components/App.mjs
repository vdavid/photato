import React, {useEffect, useState} from '../../web_modules/react.js';
import {BrowserRouter, Switch, Route, Redirect, useHistory} from '../../web_modules/react-router-dom.js';
import {useAuth0} from '../../auth/components/Auth0Provider.mjs';
import {useI18n} from '../../i18n/components/I18nProvider.mjs';
import ReactGA from '../../web_modules/react-ga.js';

import PhotoUploader from '../../upload/PhotoUploader.mjs';

import FullPageLoadingIndicator from './FullPageLoadingIndicator.mjs';
import NavigationBar from './NavigationBar.mjs';

import Error404Page from './Error404Page.mjs';
import FrontPage from '../../front-page/components/FrontPage.mjs';
import AboutPage from '../../about/components/AboutPage.mjs';
import FaqPage from '../../faq/components/FaqPage.mjs';
import ContactPage from '../../contact/components/ContactPage.mjs';
import UploadPage from '../../upload/components/UploadPage.mjs';
import CoursePage from '../../challenges/components/CoursePage.mjs';
import ChallengePage from '../../challenges/components/ChallengePage.mjs';
import MaterialsPage from '../../materials/components/MaterialsPage.mjs';
import MaterialPage from '../../materials/components/MaterialPage.mjs';
import Footer from './Footer.mjs';
import PhotatoMessagesPage from '../../admin/messages/components/PhotatoMessagesPage.mjs';
import PhotatoMessagePage from '../../admin/messages/components/PhotatoMessagePage.mjs';
import SitemapGeneratorPage from '../../admin/sitemap-generator/components/SitemapGeneratorPage.mjs';
import AdminPage from '../../admin/components/AdminPage.mjs';
import PermissionHelper from '../../auth/PermissionHelper.mjs';
import ReactPixel from '../../web_modules/react-facebook-pixel.js';

const photoUploader = new PhotoUploader();
const permissionHelper = new PermissionHelper();

export default function App() {
    const {areTranslationsLoaded} = useI18n();
    const history = useHistory();
    const {loading: isAuthLoading, isAuthenticated, user} = useAuth0();
    const [isTrackingInitialized, setIsTrackingInitialized] = useState(false);
    const [areFontsReady, setFontsReady] = useState(false);

    useEffect(() => {
        async function checkFontsLoaded() {
            // noinspection JSUnresolvedVariable (It actually exists.)
            await document.fonts.ready;
            setFontsReady(true);
        }

        // noinspection JSIgnoredPromiseFromCall
        checkFontsLoaded();
    }, []);

    /* Initialize Google Analytics page view tracking */
    useEffect(() => {
        if (history && !isTrackingInitialized) {
            history.listen(location => {
                ReactGA.set({page: location.pathname}); /* Update the user’s current page */
                ReactGA.pageview(location.pathname); /* Record a page view for the given page */
                ReactPixel.pageView();
            });
            setIsTrackingInitialized(true);
        }
    }, [history]);

    /* Set Google Analytics user sub if we have any */
    useEffect(() => {
        if (isAuthenticated) {
            ReactGA.set({
                userSub: isAuthenticated ? user.sub : undefined,
                /* Can add any data that is relevant to the session and would like to track with Google Analytics */
            });
        }
    }, [isAuthenticated]);

    const publicRoutes = _getPublicRoutes();
    const memberRoutes = _getMemberRoutes();
    const adminRoutes = _getAdminRoutes();

    return areTranslationsLoaded && areFontsReady && !isAuthLoading
        ?
        <BrowserRouter basename='/'>
            <NavigationBar/>
            <main>
                <Switch>
                    {publicRoutes}
                    {isAuthenticated ? memberRoutes :
                        <Redirect to="/"/>}
                    {isAuthenticated && permissionHelper.isAdmin(user.email) ? adminRoutes :
                        <Redirect to="/"/>}
                    <Route path='/' key='Error404Page'>
                        <Error404Page/>
                    </Route>
                </Switch>
            </main>
            <Footer/>
        </BrowserRouter>
        :
        <FullPageLoadingIndicator/>;
}

function _getPublicRoutes() {
    return [
        <Route path='/' exact={true} key='FrontPage'>
            <FrontPage/>
        </Route>,
        <Route path='/about' key='AboutPage'>
            <AboutPage/>
        </Route>,
        <Route path='/faq' key='FaqPage'>
            <FaqPage/>
        </Route>,
        <Route path='/contact' key='ContactPage'>
            <ContactPage/>
        </Route>,
        <Route path='/materials' key='MaterialsPage'>
            <MaterialsPage/>
        </Route>,
        <Route path='/:languageCode/article/:slug' key='MaterialPage'>
            <MaterialPage/>
        </Route>,
        <Route path='/:languageCode/external-article/:slug' key='MaterialPage'>
            <MaterialPage/>
        </Route>,
    ];
}

function _getMemberRoutes() {
    return [
        <Route path='/upload' key='UploadPage'>
            <UploadPage photoUploader={photoUploader}/>
        </Route>,
        <Route path='/course' exact={true} key='CoursePage'>
            <CoursePage/>
        </Route>,
        <Route path='/challenges/:weekIndex' key='ChallengePage'>
            <ChallengePage/>
        </Route>,
    ];
}

function _getAdminRoutes() {
    return [
        <Route path='/admin' exact={true} key='AdminPage'>
            <AdminPage/>
        </Route>,
        <Route path='/admin/messages' key='PhotatoMessagesPage'>
            <PhotatoMessagesPage/>
        </Route>,
        <Route path='/admin/message/:slug' key='PhotatoMessagePage'>
            <PhotatoMessagePage/>
        </Route>,
        <Route path='/admin/sitemap-generator' key='SitemapGeneratorPage'>
            <SitemapGeneratorPage/>
        </Route>,
    ];
}