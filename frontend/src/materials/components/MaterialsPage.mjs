import {articleSlugsByLanguageAndByWeek} from '../external-articles-repository.mjs';
import {createElement, useState, useEffect} from '../../web_modules/react.js';
import {useI18n} from '../../i18n/components/I18nProvider.mjs';
import {NavLink} from '../../web_modules/react-router-dom.js';
import {weeklyChallengeTitles} from '../../challenges/challengeRepository.mjs';

/**
 * @typedef {Object} ArticleMetadata
 * @property {string} slug
 * @property {string} title
 * @property {string|null} author
 * @property {Date} publishDate
 * @property {string} publisherName
 * @property {string} originalUrl
 * @property {boolean} isOriginalUrlBroken
 */
/**
 * @typedef {Object} ThirdPartyArticle
 * @property {function(): ArticleMetadata} getMetadata
 * @property {function(): string} getContent
 */

export default function MaterialsPage() {
    const {getActiveLocaleCode, __} = useI18n();

    const languageCode = getActiveLocaleCode().substring(0, 2);
    const slugsByWeek = articleSlugsByLanguageAndByWeek[languageCode];

    /* Load articles */

    const [/** @type {ThirdPartyArticle[]} */ articlesByWeek, setArticlesByWeek] = useState({});
    useEffect(() => {
        /**
         * @param {string[]} slugs
         * @returns {Promise<ThirdPartyArticle[]>}
         */
        function loadArticlesForOneWeek(slugs) {
            return Promise.all(slugs.map(slug => import('../content/' + languageCode + '/' + slug + '.mjs')));
        }

        async function loadArticlesForAllWeeks() {
            /** @type {{weekIndex: string, articles: ThirdPartyArticle[]}[]} */
            const articlePromisesForEachWeek = Object.entries(slugsByWeek).map(async ([weekIndex, slugs]) => ({weekIndex, articles: await loadArticlesForOneWeek(slugs)}));
            /** @type {Object<int, ThirdPartyArticle[]>} */
            const articlesForEachWeek = (await Promise.all(articlePromisesForEachWeek)).reduce((object, {weekIndex, articles}) => ({...object, [weekIndex]: articles}), {});
            setArticlesByWeek(articlesForEachWeek);
        }

        loadArticlesForAllWeeks().then(() => {});
    }, []);

    return [
        createElement('h1', {}, __('Articles about photography')),
        createElement('p', {
            dangerouslySetInnerHTML: {
                __html: __(`On this page we list articles that we found useful.<br />
        <em>We didn't write these articles.</em> We just like them very much.<br />
        Sadly, these great articles tend to disappear from the internet over the years. To protect them, we created cached copies for some.<br />
        Unless the link is broken, we advise you to <em>read the original version</em> to support its authors with your visit and ad views.`)
            }
        }),
        Object.keys(articlesByWeek).length
            ? Object.entries(articlesByWeek).map(([weekIndex, articles]) => renderOneWeek(weekIndex, articles))
            : __('Loading articles...'),
    ];

    /**
     * @param {int} weekIndex
     * @param {ThirdPartyArticle[]} articles
     * @returns {React.ReactElement[]|null}
     */
    function renderOneWeek(weekIndex, articles) {
        return articles.length ? [
            createElement('h2', {}, __(weeklyChallengeTitles[weekIndex - 1])),
            createElement('ul', {}, articles.map(renderArticleToListElement)),
        ] : null;
    }

    /**
     * @param {ThirdPartyArticle} article
     */
    function renderArticleToListElement(article) {
        const metadata = article.getMetadata();
        return createElement('li', {className: metadata.isOriginalUrlBroken ? 'broken' : ''}, [
            '[',
            createElement(NavLink, {to: '/external-article/' + metadata.slug}, __('🥔 cached version')),
            '] ',
            createElement('a', {href: metadata.originalUrl, target: '_blank', className: metadata.isOriginalUrlBroken ? 'brokenLink' : ''}, metadata.publisherName + ': ' + metadata.title),
            metadata.isOriginalUrlBroken && ' – az eredeti cikk már nem elérhető'
        ]);
    }
}