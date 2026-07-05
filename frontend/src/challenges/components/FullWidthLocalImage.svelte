<script lang="ts">
    interface Props {
        fileName: string;
        altText?: string;
        /** Legacy: one call site passes `alt`; it's never rendered. Accepted, not forwarded. */
        alt?: string;
        caption?: string;
        captionLink?: string;
    }

    let {fileName, altText, caption, captionLink}: Props = $props();
</script>

{#if caption}
    <p style="width: 100%; max-width: 800px; text-align: center; font-size: smaller">
        <img src={'/challenges/illustrations/' + fileName} alt={altText} style="width: 100%"/>
        <a href={captionLink}>{caption}</a>
    </p>
{:else}
    <img src={'/challenges/illustrations/' + fileName} alt={altText} style="width: 100%"/>
{/if}
