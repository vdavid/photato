import React, {useEffect, useState} from 'react';
import {BrowserRouter, Switch, Route, useHistory, Redirect} from 'react-router-dom';
import {useAuth0} from '../../auth/components/Auth0Provider.jsx';
import {useI18n} from '../../i18n/components/I18nProvider.jsx';
import ReactGA from 'react-ga';
// import LogRocket from 'logrocket';
//import {config} from '../../config.jsx';

import PhotoUploader from '../../upload/PhotoUploader.jsx';

import ScrollToTop from './ScrollToTop.jsx';
import FullPageLoadingIndicator from './FullPageLoadingIndicator.jsx';
import NavigationBar from './NavigationBar.jsx';
import BugReportButton from '../../bug-report/components/BugReportButton.jsx';

import Error404Page from './Error404Page.jsx';
import FrontPage from '../../front-page/components/FrontPage.jsx';
import AboutPage from '../../about/components/AboutPage.jsx';
import FaqPage from '../../faq/components/FaqPage.jsx';
import ContactPage from '../../contact/components/ContactPage.jsx';
import UploadPage from '../../upload/components/UploadPage.jsx';
import CoursePage from '../../challenges/components/CoursePage.jsx';
import ChallengePage from '../../challenges/components/ChallengePage.jsx';
import MaterialsPage from '../../materials/components/MaterialsPage.jsx';
import BugReportPage from '../../bug-report/components/BugReportPage.jsx';
import MaterialPage from '../../materials/components/MaterialPage.jsx';
import Footer from './Footer.jsx';
import PhotatoMessagesPage from '../../admin/messages/components/PhotatoMessagesPage.jsx';
import PhotatoMessagePage from '../../admin/messages/components/PhotatoMessagePage.jsx';
import SitemapGeneratorPage from '../../admin/sitemap-generator/components/SitemapGeneratorPage.jsx';
import AdminPage from '../../admin/components/AdminPage.jsx';
import PermissionHelper from '../../auth/PermissionHelper.jsx';
import ReactPixel from '../reactPixel.js';
import Error403Page from './Error403Page.jsx';
import {getAndRemoveRedirectPath} from '../../auth/auth0LoginHandler.jsx';
import AdminPhotosPage from '../../admin/photos/components/AdminPhotosPage.jsx';

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

            // if (config.environment === 'production') {
            //     LogRocket.identify(user.sub, { /* More info and options: https://app.logrocket.com/veujlu/photato-website/settings/setup */
            //         name: user.name,
            //         email: user.email,
            //     });
            // }
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
        <Route path='/admin/messages' key='AdminPhotatoMessagesPage'>
            {isAdmin ?
                <PhotatoMessagesPage/> :
                <Error403Page/>}
        </Route>,
        <Route path='/admin/message/:slug' key='AdminPhotatoMessagePage'>
            {isAdmin ?
                <PhotatoMessagePage/> :
                <Error403Page/>}
        </Route>,
        <Route path='/admin/photos' key='AdminPhotosPage'>
            {isAdmin ?
                <AdminPhotosPage/> :
                <Error403Page/>}
        </Route>,
        <Route path='/admin/sitemap-generator' key='SitemapGeneratorPage'>
            {isAdmin ?
                <SitemapGeneratorPage/> :
                <Error403Page/>}
        </Route>,
    ];
}