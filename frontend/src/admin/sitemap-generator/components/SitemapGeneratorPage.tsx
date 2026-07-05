import React, {useEffect} from 'react';
import {useI18n} from '../../../i18n/components/I18nProvider';
import {thirdPartyArticleSlugsByLanguageAndByWeek} from '../../../materials/articles-repository';

export default function SitemapGeneratorPage() {
    const {__} = useI18n();
    useEffect(() => {document.title = __('Sitemap generator') + ' - Photato Admin';}, []);

    const pageInfosWithRelativeUrls = [...getPublicStaticPageInfos(), ...getExternalMaterialPageInfos()];
    const pageInfosWithAbsoluteUrls
        = pageInfosWithRelativeUrls.map(pageInfo => ({...pageInfo, url: 'https://photato.eu' + pageInfo.relativeUrl}));

    const sitemapItemStrings = pageInfosWithAbsoluteUrls.map(getSitemapItemString);
    const sitemap = sitemapItemStrings.join('\n\n');

    return <>
        <h1>{__('Sitemap generator')}</h1>
        <pre className="sitemap">
            {sitemap}
        </pre>
    </>;

    function getPublicStaticPageInfos() {
        return [
            {relativeUrl: '/'},
            {relativeUrl: '/about'},
            {relativeUrl: '/faq'},
            {relativeUrl: '/contact'},
            {relativeUrl: '/materials'},
        ];
    }

    function getExternalMaterialPageInfos(): {relativeUrl: string; lastModificationDate: Date}[] {
        let result: {relativeUrl: string; lastModificationDate: Date}[] = [];
        for (const [languageCode, slugsByWeek] of Object.entries(thirdPartyArticleSlugsByLanguageAndByWeek)) {
            result = [...result, ...getExternalMaterialPageInfosForOneLocale(languageCode, slugsByWeek)];
        }
        return result;
    }

    /**
     * @param languageCode E.g. "hu"
     */
    function getExternalMaterialPageInfosForOneLocale(languageCode: string, slugsByWeek: Record<number, string[]>): {relativeUrl: string; lastModificationDate: Date}[] {
        const allSlugs = Object.values(slugsByWeek).flat();
        return allSlugs.map(slug => ({relativeUrl: '/' + languageCode + '/external-article/' + slug, lastModificationDate: new Date('2020-05-28')}));
    }

    function getSitemapItemString({url, lastModificationDate = new Date()}: {url: string; lastModificationDate?: Date}): string {
        return `<url>
    <loc>${url}</loc>
    <lastmod>${lastModificationDate.toISOString()}</lastmod>
</url>`;
    }
}