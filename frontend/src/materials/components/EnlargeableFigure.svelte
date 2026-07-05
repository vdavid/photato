<script lang="ts">
    import {config} from '../../config';
    import {getActiveLocaleCode} from '../../i18n/i18n.svelte';
    import {getMaterialContext} from './materialContext';

    const fullscreenStatuses = {
        notFullscreen: 'notFullscreen',
        goingToFullscreen: 'goingToFullscreen',
        fullscreen: 'fullscreen',
    } as const;

    interface Props {
        /** The file name for the full size file. */
        fileName: string;
        /** If omitted, the full size file name is used. */
        thumbnailFileName?: string;
        altText?: string;
        caption?: string;
    }

    let {fileName, thumbnailFileName, altText, caption}: Props = $props();

    const getMetadata = getMaterialContext();
    let imageBaseUrl = $derived(config.contentImages.thirdPartyArticlesBaseUrl + getActiveLocaleCode().substring(0, 2) + '/' + getMetadata().slug + '/');
    let fullSizeImageUrl = $derived(imageBaseUrl + fileName);
    let thumbnailImageUrl = $derived(imageBaseUrl + (thumbnailFileName || fileName));

    let figureRef = $state<HTMLElement | null>(null);
    let fullscreenStatus = $state<string>(fullscreenStatuses.notFullscreen);
    let isFullSizeImagePreloaded = $state(false);
    let isFullscreen = $derived(fullscreenStatus !== fullscreenStatuses.notFullscreen);
    let imageSrc = $derived((!isFullscreen || !isFullSizeImagePreloaded) ? thumbnailImageUrl : fullSizeImageUrl);

    $effect(() => {
        document.addEventListener('keydown', exitFullscreenOnEscape);
        return () => document.removeEventListener('keydown', exitFullscreenOnEscape);
    });

    /* When entering fullscreen, preload the full-size image, then swap it in. */
    $effect(() => {
        if (fullscreenStatus === fullscreenStatuses.goingToFullscreen) {
            const downloadingImage = new Image();
            downloadingImage.onload = () => {isFullSizeImagePreloaded = true;};
            downloadingImage.onerror = (error) => console.error(`Error loading ${fullSizeImageUrl}: ${(error as ErrorEvent).message}`);
            downloadingImage.src = fullSizeImageUrl;
            fullscreenStatus = fullscreenStatuses.fullscreen;
        }
    });

    let figureStyle = $derived.by(() => {
        if (fullscreenStatus === fullscreenStatuses.fullscreen) {
            return 'left: 0; top: 0; width: 100%; height: 100%';
        }
        if (fullscreenStatus === fullscreenStatuses.goingToFullscreen && figureRef) {
            const html = document.querySelector('html');
            if (html) {
                return `left: ${figureRef.offsetLeft - html.scrollLeft}px; top: ${figureRef.offsetTop - html.scrollTop}px; width: ${figureRef.offsetWidth}px; height: ${figureRef.offsetHeight}px`;
            }
        }
        return '';
    });

    function fullscreenClick(event: MouseEvent) {
        event.preventDefault(); /* Don't follow the link */
        fullscreenStatus = fullscreenStatuses.goingToFullscreen;
    }

    function exitFullscreenOnEscape(event: KeyboardEvent) {
        if (event.key === 'Escape') {
            exitFullscreen();
        }
    }

    function exitFullscreen(event?: MouseEvent) {
        event?.preventDefault(); /* Don't follow the link */
        fullscreenStatus = fullscreenStatuses.notFullscreen;
        isFullSizeImagePreloaded = false;
    }
</script>

<div class={'zoomOnHover enlargeable' + (isFullscreen ? ' fullscreen' : '')}>
    <figure bind:this={figureRef} onclick={!isFullscreen ? fullscreenClick : exitFullscreen} style={figureStyle}>
        <a href={!isFullscreen ? fullSizeImageUrl : ''}><img src={imageSrc} alt={altText}/></a>
        {#if caption}<figcaption>{caption}</figcaption>{/if}
    </figure>
</div>
