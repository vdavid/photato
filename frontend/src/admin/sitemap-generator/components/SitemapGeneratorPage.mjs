import React, {useEffect} from '../../../web_modules/react.js';
import {useI18n} from '../../../i18n/components/I18nProvider.mjs';
import {externalArticleSlugsByLanguageAndByWeek} from '../../../materials/articles-repository.mjs';

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

    /**
     * @returns {{relativeUrl: string, lastModificationDate: Date}[]}
     */
    function getExternalMaterialPageInfos() {
        let result = [];
        for (const [languageCode, slugsByWeek] of Object.entries(externalArticleSlugsByLanguageAndByWeek)) {
            result = [...result, ...getExternalMaterialPageInfosForOneLocale(languageCode, slugsByWeek)];
        }
        return result;
    }

    /**
     * @param {string} languageCode E.g. "hu"
     * @param {{int: string[]}} slugsByWeek
     * @returns {{relativeUrl: string, lastModificationDate: Date}[]}
     */
    function getExternalMaterialPageInfosForOneLocale(languageCode, slugsByWeek) {
        const allSlugs = Object.values(slugsByWeek).flat();
        return allSlugs.map(slug => ({relativeUrl: '/' + languageCode + '/external-article/' + slug, lastModificationDate: new Date('2020-05-28')}));
    }

    /**
     * @param {string} url
     * @param {Date} [lastModificationDate]
     * @return {string}
     */
    function getSitemapItemString({url, lastModificationDate = new Date()}) {
        return `<url>
    <loc>${url}</loc>
    <lastmod>${lastModificationDate.toISOString()}</lastmod>
</url>`;
    }
}