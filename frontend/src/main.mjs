import {config, developmentConfig, stagingConfig, productionConfig} from './config.mjs';
import {createElement, StrictMode} from './web_modules/react.js';
import {render} from './web_modules/react-dom.js';

import {Auth0Provider} from "./auth/components/Auth0Provider.mjs";
import I18nProvider from "./i18n/components/I18nProvider.mjs";
import CourseDataProvider from './challenges/components/CourseDataProvider.mjs';

import {getDefaultLocaleCodeByNavigatorPreferences} from './i18n/i18nHelper.mjs';
import {availableLocaleCodes} from './i18n/locales.mjs';

import App from './app/components/App.mjs';

import CourseDateConverter from './challenges/CourseDateConverter.mjs';

const courseDateConverter = new CourseDateConverter(config.course.startDateTime, config.course.weekCount);

/**
 * Moves keys from environment-specific configs to common config.
 * This should be done at the very beginning of the app code (which is here).
 */
function initializeConfig() {
    const environmentSpecificConfig = window.location.host.startsWith('photato.eu')
        ? productionConfig
        : (window.location.host.startsWith('staging.photato.eu') ? stagingConfig : developmentConfig);
    config.environment = environmentSpecificConfig.environment;
    config.auth0 = environmentSpecificConfig.auth0;
    config.featureSwitches = environmentSpecificConfig.featureSwitches;
}

initializeConfig();

render(
    createElement(Auth0Provider, {
            domain: config.auth0.domain,
            client_id: config.auth0.clientId,
            redirect_uri: window.location.origin,
            onRedirectCallback: () => window.history.replaceState({}, document.title, window.location.pathname),
        },
        createElement(I18nProvider, {
                availableLocaleCodes,
                translationFolderPath: '/i18n/translations/',
                // TODO: Once we have the language switcher, allow overwriting this by a manual language change, e.g. by checking for cookies or something!
                activeLocaleCode: getDefaultLocaleCodeByNavigatorPreferences(),
            },
            createElement(CourseDataProvider, {
                    courseDateConverter,
                },
                createElement(StrictMode, {},
                    createElement(App),
                ),
            ),
        ),
    ),
    document.getElementById('app')
);