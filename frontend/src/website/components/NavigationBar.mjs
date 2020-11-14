import React, {useEffect, useRef, useState} from '../../web_modules/react.js';
import {NavLink, useLocation} from '../../web_modules/react-router-dom.js';
import {config} from '../../config.mjs';
import {useAuth0} from '../../auth/components/Auth0Provider.mjs';
import {useI18n} from '../../i18n/components/I18nProvider.mjs';
import NavLinkMenuItemWithIcon from './NavLinkMenuItemWithIcon.mjs';
import PermissionHelper from '../../auth/PermissionHelper.mjs';
import {saveUrlAndLoginWithRedirect} from '../../auth/auth0LoginHandler.mjs';

const permissionHelper = new PermissionHelper();

export default function NavigationBar() {
    const {isAuthenticated, loginWithRedirect, user, logout} = useAuth0();
    const [isMenuVisible, setIsMenuVisible] = useState(false);
    const menuRef = useRef(null);
    const authenticationMenuRef = useRef(null);
    const {__} = useI18n();
    const location = useLocation();

    useEffect(() => {
        function hideMenusIfClickedOutside(event) {
            if (menuRef.current && authenticationMenuRef.current
                && !menuRef.current.contains(event.target) && !authenticationMenuRef.current.contains(event.target)) {
                setIsMenuVisible(false);
            }
        }

        document.addEventListener("mousedown", hideMenusIfClickedOutside); /* Bind the event listener */
        return () => { document.removeEventListener("mousedown", hideMenusIfClickedOutside); }; /* Unbind the event listener on clean up */

    }, [menuRef, authenticationMenuRef]);

    // noinspection HtmlUnknownTarget
    return <header role='navigation'>
        <NavLink to='/' exact={true} className='logoContainer' title='Photato'>
            <img src='/website/aperture-logo.svg' alt="logo" className="logo" />
            <img src="/website/photato-logo-text.svg" alt="Photato" className="siteTitle" />
        </NavLink>{createMainMenu()}
        <div className='spacer'/>
        {!isAuthenticated && <a href='#' className='signInLink' onClick={() => saveUrlAndLoginWithRedirect(loginWithRedirect, location.pathname)}>{__('Sign in')}</a>}
        <div className='material-icons hamburgerMenu' onClick={toggleMenuVisibility}>menu
        </div>
        {isAuthenticated &&
        <img src={user.picture} alt={__('Profile picture')} onClick={toggleMenuVisibility} className='profilePicture'/>}{isAuthenticated && createAuthenticationMenu()}
    </header>;


    function handleSignOut() {
        logout({returnTo: window.location.origin});
    }

    function createMainMenu() {
        /* List of icons: https://material.io/resources/icons/?style=baseline */
        return <nav ref={menuRef} className={isMenuVisible ? ' visible' : ''} onClick={() => {
            setIsMenuVisible(false);
        }}>
            <NavLinkMenuItemWithIcon to='/' exact={true} activeClassName='active' iconName='home'>{__('Home')}</NavLinkMenuItemWithIcon>
            <NavLinkMenuItemWithIcon to='/about' activeClassName='active' iconName='face'>{__('About')}</NavLinkMenuItemWithIcon>
            <NavLinkMenuItemWithIcon to='/faq' activeClassName='active' iconName='help'>{__('FAQ')}</NavLinkMenuItemWithIcon>
            <NavLinkMenuItemWithIcon to='/contact' activeClassName='active' iconName='alternate_email'>{__('Contact')}</NavLinkMenuItemWithIcon>
            {isAuthenticated ?
                <NavLinkMenuItemWithIcon to='/course' activeClassName='active' iconName='casino'>{config.course.titleWithoutPhotato}</NavLinkMenuItemWithIcon> : null}
            <NavLinkMenuItemWithIcon to='/materials' activeClassName='active' iconName='book'>{__('Materials')}</NavLinkMenuItemWithIcon>
            {isAuthenticated && permissionHelper.isAdmin(user.email) ? <NavLinkMenuItemWithIcon to='/admin' activeClassName='active' iconName='lock'>{__('Admin')}</NavLinkMenuItemWithIcon> : null}
            {isAuthenticated ?
                <div className='menuItem separator'>
                    <span className='material-icons'/>
                    <hr/>
                </div> : null}
            {isAuthenticated ?
                <a href='#' className='menuItem signOut' onClick={handleSignOut}><span className='profile icon'><img src={user.picture} alt={__('Profile picture')} className='profilePicture'/></span><span className='title'>{__('Sign out')}</span></a> : null}
        </nav>;
    }

    function createAuthenticationMenu() {
        const className = 'authenticationMenu' + (isMenuVisible ? ' visible' : '');

        function hideMenu() {
            setIsMenuVisible(false);
        }

        return <nav ref={authenticationMenuRef} className={className} onClick={hideMenu}>
            <a href='#' className='menuItem signOut' onClick={handleSignOut}><span className='icon material-icons'>exit_to_app</span><span className='title'>{__('Sign out')}</span></a>
        </nav>;
    }

    function toggleMenuVisibility() {
        setIsMenuVisible(!isMenuVisible);
    }
}
