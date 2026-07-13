<script lang="ts">
    import { config } from '../../config'
    import { getActiveLocaleCode } from '../../i18n/i18n.svelte'
    import { getMaterialContext } from './materialContext'

    interface Props {
        fileName: string
        altText?: string
        /** Legacy: some call sites pass `alt`; it's never rendered. Accepted, not forwarded. */
        alt?: string
        titleText?: string
        caption?: string
        /** CSS width for the element. Default "100%". */
        width?: string
    }

    // `alt` is a legacy prop: accepted for compatibility, intentionally not rendered.
    const { fileName, altText, titleText, caption, width = '100%', alt: _alt }: Props = $props()

    const getMetadata = getMaterialContext()
    const imageUrl = $derived(
        config.contentImages.thirdPartyArticlesBaseUrl +
            getActiveLocaleCode().substring(0, 2) +
            '/' +
            getMetadata().slug +
            '/' +
            fileName,
    )
</script>

<div class="simpleFigure">
    <figure style="width: {width}">
        <img src={imageUrl} alt={altText} title={titleText} />{#if caption}<figcaption>{caption}</figcaption>{/if}
    </figure>
</div>
