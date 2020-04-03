import {createElement} from '/web_modules/react.js';
import {useAuth0} from '../app/react-auth0-spa.mjs';
import {NavLink} from '../web_modules/react-router-dom.js';

export default function AuthenticatedFrontPage() {
    const {user} = useAuth0();

    return [
        createElement('h1', {}, 'Welcome to Photato, ' + user.given_name + '!'),
        createElement(NavLink, {to: '/upload', activeClassName: 'active'}, 'Upload a photo here'),
    ];
}