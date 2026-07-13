<script lang="ts">
    import type { Component } from 'svelte'
    import { __, getActiveLocaleCode } from '../../i18n/i18n.svelte'
    import NavLinkButton from '../../website/components/NavLinkButton.svelte'
    import { setMaterialContext } from './materialContext'
    import type { ArticleMetadata, LoadedArticle } from '../types'

    interface Props {
        languageCode: string
        slug: string
        isExternalArticle?: boolean
    }

    const { languageCode, slug, isExternalArticle = false }: Props = $props()

    let metadata = $state<ArticleMetadata | null>(null)
    let ArticleComponent = $state<Component | null>(null)
    let isLoaded = $state(false)

    /* Figures inside the article read the metadata (for image URLs) through this getter. */
    setMaterialContext(() => metadata as ArticleMetadata)

    $effect(() => {
        const currentSlug = slug
        const external = isExternalArticle
        const language = languageCode
        isLoaded = false
        metadata = null
        ArticleComponent = null

        void (async () => {
            const module = (
                external
                    ? await import(`../third-party-content/${language}/${currentSlug}.svelte`)
                    : await import(`../own-content/${language}/${currentSlug}.svelte`)
            ) as LoadedArticle
            metadata = module.getMetadata()
            ArticleComponent = module.default
            isLoaded = true
            document.title = metadata.title + ' - Photato'
        })()
    })
</script>

{#if isLoaded && metadata && ArticleComponent}
    {@const Article = ArticleComponent}
    <p>
        <NavLinkButton to="/materials">{'←' + __('Back to the list of materials')}</NavLinkButton>
    </p>
    <article>
        <header>
            <h1>{metadata.title}</h1>
            <p class="metadata articleMetadata">
                {__('Author') + ': ' + metadata.author} — {__('Publication date') +
                    ': ' +
                    metadata.publishDate.toLocaleDateString(getActiveLocaleCode())}{#if metadata.originalUrl}
                    — <a href={metadata.originalUrl} target="_blank">{__('Original article')}</a>{/if}
            </p>
        </header>
        <Article />
    </article>
    <p>
        {#if !isExternalArticle}<NavLinkButton to="/upload">{__('Upload your best photo')}</NavLinkButton>{/if}
        <NavLinkButton to="/materials">{'←' + __('Back to the list of materials')}</NavLinkButton>
    </p>
{:else}
    {__('Loading article...')}
    <p>
        <NavLinkButton to="/materials">{'←' + __('Back to the list of materials')}</NavLinkButton>
    </p>
{/if}
