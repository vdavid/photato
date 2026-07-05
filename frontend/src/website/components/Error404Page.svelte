<script lang="ts">
    import {__} from '../../i18n/i18n.svelte';
    import NavLinkButton from './NavLinkButton.svelte';

    $effect(() => {document.title = __('404 error') + ' - Photato';});
</script>

<h1>{__('404 error')}</h1>
<p>{__('This page does not exist.')}</p>
<p><NavLinkButton to="/">{__('Return to the Photato main page.')}</NavLinkButton></p>
