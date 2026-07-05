<script lang="ts">
    import {__} from '../../i18n/i18n.svelte';
    import {auth} from '../../auth/auth.svelte';
    import {navigate} from '../router.svelte';
    import NavLinkButton from './NavLinkButton.svelte';

    $effect(() => {document.title = __('403 error') + ' - Photato';});
</script>

{#if auth.isAuthenticated}
    <h1>{__('403 error')}</h1>
    <p>{__('Unfortunately, you can’t see this page.')}</p>
    <p><NavLinkButton to="/">{__('Return to the Photato main page.')}</NavLinkButton></p>
{:else}
    <h1>{__('403 error')}</h1>
    <p>{__('This page is only for members. Log in or sign up here:')}</p>
    <p><button onclick={() => navigate('/login')}>{__('Sign in')}</button></p>
    <p><NavLinkButton to="/">{__('Return to the Photato main page.')}</NavLinkButton></p>
{/if}
