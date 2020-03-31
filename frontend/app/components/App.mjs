import {UploadPage} from '../../upload/components/UploadPage.mjs';

const React = window.React;
const {BrowserRouter, Switch, Route, Redirect} = window.ReactRouterDOM;
import NavigationBar from './NavigationBar.mjs';

export const App = () => {
    return React.createElement(BrowserRouter, {basename: '/'},
        React.createElement(NavigationBar),
        React.createElement('main', null,
            React.createElement(Switch, null,
                React.createElement(Route, {path: '/upload', component: () => React.createElement(UploadPage, {})}),
                React.createElement(Route, {path: '/about', component: () => React.createElement('h2', {}, 'Hello')}),
                React.createElement(Route, {path: '/', component: () => React.createElement(UploadPage)}),
                React.createElement(Redirect, {path: '*', to: {...window.history, pathname: '/'}}),
            ),
        ),
        React.createElement('footer', null, React.createElement('span', {className: 'copyright'}, 'Made with ❤️ by the Photato team')),
    );
};
