import {config, developmentConfig, stagingConfig, productionConfig} from './config.mjs';
import {createElement, StrictMode} from '/web_modules/react.js';
import {render} from '/web_modules/react-dom.js';

import store from './reduxStore.mjs';
import {Auth0Provider} from "./react-auth0-spa.mjs";
import App from './components/App.mjs';

import {Provider} from '/web_modules/react-redux.js';

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
}

function onRedirectCallback(appState) {
    return window.history.replaceState({}, document.title, window.location.pathname);
//    history.push(appState && appState.targetUrl ? appState.targetUrl : window.location.pathname);
}

initializeConfig();

render(
    createElement(Provider, {store},
        createElement(Auth0Provider, {
                domain: config.auth0.domain,
                client_id: config.auth0.clientId,
                redirect_uri: window.location.origin,
                onRedirectCallback,
            },
            createElement(StrictMode, {},
                createElement(App),
            ),
        ),
    ),
    document.getElementById('app')
);