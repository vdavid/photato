import React from '/web_modules/react.js';
import {BrowserRouter, Switch, Route, Redirect} from '/web_modules/react-router-dom.js';
import {useI18n} from '../../i18n/components/I18nProvider.mjs';

import FullPageLoadingIndicator from './FullPageLoadingIndicator.mjs';
import NavigationBar from './NavigationBar.mjs';

import FrontPage from '../../front-page/components/FrontPage.mjs';
import AboutPage from '../../about/AboutPage.mjs';
import UploadPage from '../../upload/components/UploadPage.mjs';

export default function App() {
    const {areTranslationsLoaded, __} = useI18n();
    return areTranslationsLoaded
        ? (React.createElement(BrowserRouter, {basename: '/'},
        React.createElement(NavigationBar),
        React.createElement('main', null,
            React.createElement(Switch, null,
                React.createElement(Route, {path: '/about', component: () => React.createElement(AboutPage)}),
                React.createElement(Route, {path: '/upload', component: () => React.createElement(UploadPage)}),
                React.createElement(Route, {path: '/challenges', component: () => React.createElement(FrontPage)}),
                React.createElement(Route, {path: '/', component: () => React.createElement(FrontPage)}),
                React.createElement(Redirect, {path: '*', to: {...window.history, pathname: '/'}}),
            ),
        ),
        React.createElement('footer', null, React.createElement('span', {className: 'copyright'}, __('Made with ❤️ by the Photato team'))),
    ))
        : React.createElement(FullPageLoadingIndicator);
}
