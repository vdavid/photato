<script lang="ts">
    import {onMount} from 'svelte';
    import {__} from '../../i18n/i18n.svelte';
    import {location, navigate} from '../../website/router.svelte';
    import {verify} from '../auth.svelte';
    import Link from '../../website/components/Link.svelte';

    let status = $state<'verifying' | 'error'>('verifying');

    $effect(() => {document.title = __('Sign in to Photato') + ' - Photato';});

    onMount(async () => {
        const token = new URLSearchParams(location.search).get('token');
        if (!token) {
            status = 'error';
            return;
        }
        let ok = false;
        try {
            ok = await verify(token);
        } catch (error) {
            console.error('Verification request failed:', error);
        }
        if (ok) {
            navigate('/', {replace: true});
        } else {
            status = 'error';
        }
    });
</script>

{#if status === 'verifying'}
    <p>{__('Signing you in…')}</p>
{:else}
    <h1>{__('Sign in to Photato')}</h1>
    <p>{__('This link is invalid or has expired — request a new one.')}</p>
    <p><Link to="/login">{__('Back to the login page')}</Link></p>
{/if}
