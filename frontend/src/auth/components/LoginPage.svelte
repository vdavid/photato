<script lang="ts">
    import {__} from '../../i18n/i18n.svelte';
    import {requestLink} from '../auth.svelte';

    let email = $state('');
    let isSubmitted = $state(false);

    $effect(() => {document.title = __('Sign in to Photato') + ' - Photato';});

    async function handleSubmit(event: SubmitEvent) {
        event.preventDefault();
        await requestLink(email);
        isSubmitted = true;
    }
</script>

<h1>{__('Sign in to Photato')}</h1>
{#if isSubmitted}
    <p class="loginConfirmation">{__('Check your email for a login link.')}</p>
{:else}
    <p>{__('Enter your email and we’ll send you a login link.')}</p>
    <form class="loginForm" onsubmit={handleSubmit}>
        <p>
            <input type="email" name="email" required placeholder={__('Your email address')} bind:value={email} autocomplete="email"/>
        </p>
        <button type="submit">{__('Send me a login link')}</button>
    </form>
{/if}
