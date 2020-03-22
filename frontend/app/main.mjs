import {config} from './config.mjs';

const {React, ReactDOM} = window;
import store from './reduxStore.mjs';
import {Auth0Provider} from "./react-auth0-spa.mjs";
import {App} from './components/App.mjs';

const {StrictMode} = window.React;

const {Provider} = window.ReactRedux;

function onRedirectCallback(appState) {
    return window.history.replaceState({}, document.title, window.location.pathname);
//    history.push(appState && appState.targetUrl ? appState.targetUrl : window.location.pathname);
}

ReactDOM.render(
    React.createElement(Provider, {store},
        React.createElement(Auth0Provider, {
                domain: config.auth0.domain,
                client_id: config.auth0.clientId,
                redirect_uri: window.location.origin,
                onRedirectCallback,
            },
            React.createElement(StrictMode, {},
                React.createElement(App),
            ),
        ),
    ),
    document.getElementById('app')
);