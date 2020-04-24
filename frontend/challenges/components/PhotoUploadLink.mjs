import {createElement} from '../../web_modules/react.js';
import {NavLink} from '../../web_modules/react-router-dom.js';

export default function PhotoUploadLink({label}) {
    return createElement(NavLink, {to: '/upload'}, label);
}