import {UploadPage} from '../../upload/components/UploadPage.mjs';

const React = window.React;
const {BrowserRouter, Switch, Route, Redirect, Link} = window.ReactRouterDOM;
import {LoadingIndicator} from './LoadingIndicator.mjs';
import {useAuth0} from '../react-auth0-spa.mjs';

export const App = () => {
    const {loading, isAuthenticated, user, loginWithRedirect, logout} = useAuth0();

    return React.createElement(BrowserRouter, {basename: '/'},
        React.createElement('header', {},
            React.createElement('div', {className: 'logo'}),
            React.createElement('nav', {},
                React.createElement('ul', {},
                    React.createElement('li', {},
                        React.createElement(Link, {to: '/'}, 'Home'),
                        React.createElement(Link, {to: '/about'}, 'About'),
                        isAuthenticated ? React.createElement(Link, {to: '/upload'}, 'Upload') : '',
                        React.createElement('button', {id: 'btn-login', disabled: isAuthenticated, onClick: handleLogin}, 'Log in'),
                        React.createElement('button', {id: 'btn-logout', disabled: !isAuthenticated, onClick: handleLogout}, 'Log out'),
                        React.createElement('div', {className: 'profilePicture'},
                            (!loading && user)
                                ? React.createElement('img', {src: user.picture, alt: 'Profile picture'})
                                : React.createElement(LoadingIndicator),
                        ),
                    ),
                )
            ),
        ),
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

    function handleLogin() {
        loginWithRedirect({});
    }

    function handleLogout() {
        logout({
            returnTo: window.location.origin
        });
    }
};
