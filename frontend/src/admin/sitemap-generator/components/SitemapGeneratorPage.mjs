import {config} from '../../../config.mjs';
import React, {useEffect} from '../../../web_modules/react.js';
import {useI18n} from '../../../i18n/components/I18nProvider.mjs';
import {useCourseData} from '../../../challenges/components/CourseDataProvider.mjs';
import {articleSlugsByLanguageAndByWeek} from '../../../materials/external-articles-repository.mjs';

export default function SitemapGeneratorPage() {
    const {__} = useI18n();
    useEffect(() => {document.title = __('Sitemap generator') + ' - Photato Admin';}, []);

    const pageInfosWithRelativeUrls = [...getPublicStaticPageInfos(), ...getChallengePageInfos(), ...getExternalMaterialPageInfos()];
    const pageInfosWithAbsoluteUrls = pageInfosWithRelativeUrls.map(pageInfo => ({...pageInfo, url: config.baseUrl + pageInfo.relativeUrl}));

    const sitemapItemStrings = pageInfosWithAbsoluteUrls.map(getSitemapItemString);
    const sitemap=sitemapItemStrings.join('\n\n');

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
            {relativeUrl: '/upload'},
            {relativeUrl: '/challenges'},
            {relativeUrl: '/materials'},
        ];
    }

    function getChallengePageInfos() {
        const weekCount = config.course.weekCount;
        const {currentWeekIndex} = useCourseData();
        const weekIndexes = Array.from(Array(Math.min(currentWeekIndex, weekCount)), (value, key) => key + 1);
        return weekIndexes.map(weekIndex => ({relativeUrl:'/challenges/' + weekIndex}));
    }

    function getExternalMaterialPageInfos() {
        /** @type {Object<int, string[]>[]} */
        const slugsByWeekForAllLanguages = Object.values(articleSlugsByLanguageAndByWeek);
        /** @type {string[][][]} */
        const slugsForAllWeeksForAllLanguages = slugsByWeekForAllLanguages.map(slugsByWeekForOneLanguage => Object.values(slugsByWeekForOneLanguage));
        const slugs = slugsForAllWeeksForAllLanguages.flat(2);
        return slugs.map(slug => ({relativeUrl: '/external-article/' + slug, lastModificationDate: new Date('2020-04-28')}));
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