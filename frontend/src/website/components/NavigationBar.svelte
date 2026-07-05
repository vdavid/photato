<script lang="ts">
    import {config} from '../../config';
    import {__} from '../../i18n/i18n.svelte';
    import {auth, logout} from '../../auth/auth.svelte';
    import {navigate} from '../router.svelte';
    import Link from './Link.svelte';
    import NavLinkMenuItemWithIcon from './NavLinkMenuItemWithIcon.svelte';

    let isMenuVisible = $state(false);
    let menuRef = $state<HTMLElement | null>(null);

    /* Hide the popup menu when clicking anywhere outside it (mobile only; on desktop the menu is a fixed
     * bar and this is a no-op). */
    $effect(() => {
        function hideMenuIfClickedOutside(event: MouseEvent) {
            if (menuRef && !menuRef.contains(event.target as Node)) {
                isMenuVisible = false;
            }
        }
        document.addEventListener('mousedown', hideMenuIfClickedOutside);
        return () => document.removeEventListener('mousedown', hideMenuIfClickedOutside);
    });

    function toggleMenuVisibility() {
        isMenuVisible = !isMenuVisible;
    }

    async function handleSignOut() {
        await logout();
        navigate('/');
    }
</script>

<header role="navigation">
    <Link to="/" exact={true} class="logoContainer" title="Photato">
        <img src="/website/aperture-logo.svg" alt="logo" class="logo"/>
        <img src="/website/photato-logo-text.svg" alt="Photato" class="siteTitle"/>
    </Link>
    <nav bind:this={menuRef} class={isMenuVisible ? 'visible' : ''} onclick={() => (isMenuVisible = false)}>
        <NavLinkMenuItemWithIcon to="/" exact={true} iconName="home">{__('Home')}</NavLinkMenuItemWithIcon>
        <NavLinkMenuItemWithIcon to="/about" iconName="face">{__('About')}</NavLinkMenuItemWithIcon>
        <NavLinkMenuItemWithIcon to="/faq" iconName="help">{__('FAQ')}</NavLinkMenuItemWithIcon>
        <NavLinkMenuItemWithIcon to="/contact" iconName="alternate_email">{__('Contact')}</NavLinkMenuItemWithIcon>
        {#if auth.isAuthenticated}
            <NavLinkMenuItemWithIcon to="/course" iconName="casino">{config.course.titleWithoutPhotato}</NavLinkMenuItemWithIcon>
        {/if}
        <NavLinkMenuItemWithIcon to="/materials" iconName="book">{__('Materials')}</NavLinkMenuItemWithIcon>
        {#if auth.isAdmin}
            <NavLinkMenuItemWithIcon to="/admin" iconName="lock">{__('Admin')}</NavLinkMenuItemWithIcon>
        {/if}
        {#if auth.isAuthenticated}
            <a href="#logout" class="menuItem" onclick={(event) => {event.preventDefault(); void handleSignOut();}}><span class="icon material-icons">exit_to_app</span><span class="title">{__('Sign out')}</span></a>
        {/if}
    </nav>
    <div class="spacer"></div>
    {#if !auth.isAuthenticated}
        <a href="/login" class="signInLink" onclick={(event) => {event.preventDefault(); navigate('/login');}}>{__('Sign in')}</a>
    {/if}
    <div class="material-icons hamburgerMenu" onclick={toggleMenuVisibility}>menu</div>
</header>
