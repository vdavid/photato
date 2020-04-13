import {createElement} from '/web_modules/react.js';
import {NavLink} from '../../web_modules/react-router-dom.js';

/**
 * @param {string} [iconName]
 * @param {ReactElement} children
 * @param {Object<string, *>} props
 * @returns {ReactElement}
 * @constructor
 */
export default function NavLinkMenuItemWithIcon({iconName, children, ...props} = {}) {
    return createElement(NavLink, {className: 'menuItem', ...props},
        createElement('span', {className: 'icon material-icons'}, iconName),
        createElement('span', {className: 'title'}, children),
    );
}
