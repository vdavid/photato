<script lang="ts">
    import { __, areTranslationsLoaded } from '../../i18n/i18n.svelte'

    let isTakingLong = $state(false)
    $effect(() => {
        const timeout = setTimeout(() => {
            isTakingLong = true
        }, 4000)
        return () => {
            clearTimeout(timeout)
        }
    })
</script>

<div id="fullPageLoadingIndicator">
    <div>
        <div class="spinner"></div>
        <div class="logo">
            <img src="/website/aperture-logo.svg" alt="logo" class="logo" />
            <img src="/website/photato-logo-text.svg" alt="Photato" class="siteTitle" />
        </div>
    </div>
    {#if isTakingLong && areTranslationsLoaded()}
        <div class="loadingTakingLong">
            <!-- eslint-disable-next-line svelte/no-at-html-tags -- trusted: renders our own translation string, not user input -->
            {@html __(
                'Loading seems to take longer than usual. If you think this is a problem, please report it here.',
            )}
        </div>
    {/if}
</div>
