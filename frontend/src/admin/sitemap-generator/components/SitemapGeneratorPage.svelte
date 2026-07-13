<script lang="ts">
    import { __ } from '../../../i18n/i18n.svelte'
    import { thirdPartyArticleSlugsByLanguageAndByWeek } from '../../../materials/articles-repository'

    $effect(() => {
        document.title = __('Sitemap generator') + ' - Photato Admin'
    })

    function getPublicStaticPageInfos(): { relativeUrl: string }[] {
        return [
            { relativeUrl: '/' },
            { relativeUrl: '/about' },
            { relativeUrl: '/faq' },
            { relativeUrl: '/contact' },
            { relativeUrl: '/materials' },
        ]
    }

    function getExternalMaterialPageInfosForOneLocale(
        languageCode: string,
        slugsByWeek: Record<number, string[]>,
    ): { relativeUrl: string; lastModificationDate: Date }[] {
        const allSlugs = Object.values(slugsByWeek).flat()
        return allSlugs.map((slug) => ({
            relativeUrl: '/' + languageCode + '/external-article/' + slug,
            lastModificationDate: new Date('2020-05-28'),
        }))
    }

    function getExternalMaterialPageInfos(): { relativeUrl: string; lastModificationDate: Date }[] {
        let result: { relativeUrl: string; lastModificationDate: Date }[] = []
        for (const [languageCode, slugsByWeek] of Object.entries(thirdPartyArticleSlugsByLanguageAndByWeek)) {
            result = [...result, ...getExternalMaterialPageInfosForOneLocale(languageCode, slugsByWeek)]
        }
        return result
    }

    function getSitemapItemString({
        url,
        lastModificationDate = new Date(),
    }: {
        url: string
        lastModificationDate?: Date
    }): string {
        return `<url>
    <loc>${url}</loc>
    <lastmod>${lastModificationDate.toISOString()}</lastmod>
</url>`
    }

    const pageInfosWithRelativeUrls = [...getPublicStaticPageInfos(), ...getExternalMaterialPageInfos()]
    const pageInfosWithAbsoluteUrls = pageInfosWithRelativeUrls.map((pageInfo) => ({
        ...pageInfo,
        url: 'https://photato.eu' + pageInfo.relativeUrl,
    }))
    const sitemap = pageInfosWithAbsoluteUrls.map(getSitemapItemString).join('\n\n')
</script>

<h1>{__('Sitemap generator')}</h1>
<pre class="sitemap">{sitemap}</pre>
