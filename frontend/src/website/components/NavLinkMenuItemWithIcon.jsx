import React from 'react';
import {NavLink} from 'react-router-dom';

/**
 * @param {string} [iconName]
 * @param {ReactElement} children
 * @param {Object<string, *>} props
 * @returns {ReactElement}
 * @constructor
 */
export default function NavLinkMenuItemWithIcon({iconName, children, ...props} = {}) {
    return <NavLink className='menuItem' {...props}><span className='icon material-icons'>{iconName}</span><span className='title'>{children}</span></NavLink>;
}
