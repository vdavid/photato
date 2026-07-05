import {config, developmentConfig, stagingConfig, productionConfig} from './config';
import React, {StrictMode} from 'react';
import {render} from 'react-dom';
import ReactGA from 'react-ga';
import ReactPixel from './website/reactPixel';
// import LogRocket from 'logrocket';

import {Auth0Provider} from "./auth/components/Auth0Provider";
import I18nProvider from "./i18n/components/I18nProvider";
import CourseDataProvider from './challenges/components/CourseDataProvider';

import {getDefaultLocaleCodeByNavigatorPreferences} from './i18n/i18nHelper';
import {availableLocaleCodes} from './i18n/locales';

import App from './website/components/App';

import CourseDateConverter from './challenges/CourseDateConverter';

const courseDateConverter = new CourseDateConverter(config.course.startDateTime, config.course.weekCount);

initializeConfig();
initializeTracking();
//(config.environment === 'production') && initializeLogRocket();

render(
    <Auth0Provider domain={config.auth0.domain}
                   client_id={config.auth0.clientId}
                   redirect_uri={window.location.origin}
                   onRedirectCallback={onRedirectCallback}>
        <I18nProvider availableLocaleCodes={availableLocaleCodes}
            // TODO: Once we have the language switcher, allow overwriting this by a manual language change, e.g. by checking for cookies or something!
                      activeLocaleCode={getDefaultLocaleCodeByNavigatorPreferences()}>
            <CourseDataProvider courseDateConverter={courseDateConverter}>
                <StrictMode>
                    <App/>
                </StrictMode>
            </CourseDataProvider>
        </I18nProvider>
    </Auth0Provider>, document.getElementById('app'));

/**
 * Moves keys from environment-specific configs to common config.
 * This should be done at the very beginning of the app code (which is here).
 */
function initializeConfig() {
    const environmentSpecificConfig = window.location.host.startsWith('photato.eu')
        ? productionConfig
        : (window.location.host.startsWith('staging.photato.eu') ? stagingConfig : developmentConfig);
    config.environment = environmentSpecificConfig.environment;
    config.baseUrl = environmentSpecificConfig.baseUrl;
    config.auth0 = environmentSpecificConfig.auth0;
    config.featureSwitches = environmentSpecificConfig.featureSwitches;
    config.backendApi.environment = environmentSpecificConfig.backendApi.environment;
}

function initializeTracking() {
    ReactGA.initialize(config.tracking.googleTrackingCode, {
        debug: config.environment === 'development',
        titleCase: false,
    });
    ReactGA.pageview(window.location.pathname + window.location.search);

    const options = {
        autoConfig: true, /* Sets pixel to autoConfig. */
        debug: config.environment === 'development', /* Enables logs */
    };
    /* Info: https://github.com/zsajjad/react-facebook-pixel */
    ReactPixel.init(config.tracking.facebookPixelId, {}, options);
    ReactPixel.pageView();
}

// function initializeLogRocket() {
//     LogRocket.init('veujlu/photato-website');
// }
function onRedirectCallback() {
    window.history.replaceState({}, document.title, window.location.pathname);
}
