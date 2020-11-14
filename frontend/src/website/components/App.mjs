import React, {useEffect, useState} from '../../web_modules/react.js';
import {BrowserRouter, Switch, Route, useHistory, Redirect} from '../../web_modules/react-router-dom.js';
import {useAuth0} from '../../auth/components/Auth0Provider.mjs';
import {useI18n} from '../../i18n/components/I18nProvider.mjs';
import ReactGA from '../../web_modules/react-ga.js';
import LogRocket from '../../web_modules/logrocket.js';
import {config} from '../../config.mjs';

import PhotoUploader from '../../upload/PhotoUploader.mjs';

import ScrollToTop from './ScrollToTop.mjs';
import FullPageLoadingIndicator from './FullPageLoadingIndicator.mjs';
import NavigationBar from './NavigationBar.mjs';
import BugReportButton from '../../bug-report/components/BugReportButton.mjs';

import Error404Page from './Error404Page.mjs';
import FrontPage from '../../front-page/components/FrontPage.mjs';
import AboutPage from '../../about/components/AboutPage.mjs';
import FaqPage from '../../faq/components/FaqPage.mjs';
import ContactPage from '../../contact/components/ContactPage.mjs';
import UploadPage from '../../upload/components/UploadPage.mjs';
import CoursePage from '../../challenges/components/CoursePage.mjs';
import ChallengePage from '../../challenges/components/ChallengePage.mjs';
import MaterialsPage from '../../materials/components/MaterialsPage.mjs';
import BugReportPage from '../../bug-report/components/BugReportPage.mjs';
import MaterialPage from '../../materials/components/MaterialPage.mjs';
import Footer from './Footer.mjs';
import PhotatoMessagesPage from '../../admin/messages/components/PhotatoMessagesPage.mjs';
import PhotatoMessagePage from '../../admin/messages/components/PhotatoMessagePage.mjs';
import SitemapGeneratorPage from '../../admin/sitemap-generator/components/SitemapGeneratorPage.mjs';
import AdminPage from '../../admin/components/AdminPage.mjs';
import PermissionHelper from '../../auth/PermissionHelper.mjs';
import ReactPixel from '../../web_modules/react-facebook-pixel.js';
import Error403Page from './Error403Page.mjs';
import {getAndRemoveRedirectPath} from '../../auth/auth0LoginHandler.mjs';

const photoUploader = new PhotoUploader();
const permissionHelper = new PermissionHelper();

export default function App() {
    const {areTranslationsLoaded} = useI18n();
    const history = useHistory();
    /* User type: https://auth0.com/docs/api/authentication#user-profile or check “auth0UserInfoSchema” in back end */
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
        if (isAuthenticated && user) {
            ReactGA.set({
                userSub: isAuthenticated ? user.sub : undefined,
                /* Can add any data that is relevant to the session and would like to track with Google Analytics */
            });

            if (config.environment === 'production') {
                LogRocket.identify(user.sub, { /* More info and options: https://app.logrocket.com/veujlu/photato-website/settings/setup */
                    name: user.name,
                    email: user.email,
                });
            }
        }
    }, [isAuthenticated, user]);

    const publicRoutes = _getPublicRoutes();
    const memberRoutes = _getMemberRoutes(isAuthenticated);
    const adminRoutes = _getAdminRoutes(isAuthenticated && user && permissionHelper.isAdmin(user.email));

    return areTranslationsLoaded && areFontsReady && !isAuthLoading
        ?
        <BrowserRouter basename='/'>
            <ScrollToTop/>
            <NavigationBar/>
            <BugReportButton/>
            <main>
                <Switch>
                    {publicRoutes}
                    {memberRoutes}
                    {adminRoutes}
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
        <Route path='/bug-report' key='BugReportPage'>
            <BugReportPage/>
        </Route>,
        <Route path='/:languageCode/article/:slug' key='MaterialPage'>
            <MaterialPage/>
        </Route>,
        <Route path='/:languageCode/external-article/:slug' key='MaterialPage'>
            <MaterialPage/>
        </Route>,
        <Route path='/login-callback' key='LoginCallbackRedirect'>
            <Redirect to={getAndRemoveRedirectPath() || '/'}/>
        </Route>,
    ];
}

function _getMemberRoutes(isAuthenticated) {
    return [
        <Route path='/upload' key='UploadPage'>
            {isAuthenticated ?
                <UploadPage photoUploader={photoUploader}/> :
                <Error403Page/>}
        </Route>,
        <Route path='/course' exact={true} key='CoursePage'>
            {isAuthenticated ?
                <CoursePage/> :
                <Error403Page/>}
        </Route>,
        <Route path='/challenges/:weekIndex' key='ChallengePage'>
            {isAuthenticated ?
                <ChallengePage/> :
                <Error403Page/>}
        </Route>,
    ];
}

function _getAdminRoutes(isAdmin) {
    return [
        <Route path='/admin' exact={true} key='AdminPage'>
            {isAdmin ?
                <AdminPage/> :
                <Error403Page/>}
        </Route>,
        <Route path='/admin/messages' key='PhotatoMessagesPage'>
            {isAdmin ?
                <PhotatoMessagesPage/> :
                <Error403Page/>}
        </Route>,
        <Route path='/admin/message/:slug' key='PhotatoMessagePage'>
            {isAdmin ?
                <PhotatoMessagePage/> :
                <Error403Page/>}
        </Route>,
        <Route path='/admin/sitemap-generator' key='SitemapGeneratorPage'>
            {isAdmin ?
                <SitemapGeneratorPage/> :
                <Error403Page/>}
        </Route>,
    ];
}