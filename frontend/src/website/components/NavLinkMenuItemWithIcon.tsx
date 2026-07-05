import React from 'react';
import {NavLink, NavLinkProps} from 'react-router-dom';

interface NavLinkMenuItemWithIconProps extends NavLinkProps {
    iconName?: string;
}

export default function NavLinkMenuItemWithIcon({iconName, children, ...props}: NavLinkMenuItemWithIconProps) {
    return <NavLink className='menuItem' {...props}><span className='icon material-icons'>{iconName}</span><span className='title'>{children}</span></NavLink>;
}
