import {articleSlugsByLanguageAndByWeek} from '../external-articles-repository.mjs';
import React, {useState, useEffect} from '../../web_modules/react.js';
import {useI18n} from '../../i18n/components/I18nProvider.mjs';
import {NavLink} from '../../web_modules/react-router-dom.js';
import {weeklyChallengeTitles} from '../../challenges/challengeRepository.mjs';
import ExternalLink from './ExternalLink.mjs';

/**
 * @typedef {Object} ArticleMetadata
 * @property {string} slug
 * @property {string} title
 * @property {string|null} author
 * @property {Date} publishDate
 * @property {string} publisherName
 * @property {string} [originalUrl] Only applicable for external articles.
 * @property {boolean} [isOriginalUrlBroken] Only applicable for external articles.
 * @property {int} [unlockWeekIndex] A one-based index which determines the week when the article is
 *           first displayed for students. If not defined then it's always displayed.
 */
/**
 * @typedef {Object} ThirdPartyArticle
 * @property {function(): ArticleMetadata} getMetadata
 * @property {function(): string} getContent
 */

export default function MaterialsPage() {
    const {getActiveLocaleCode, __} = useI18n();

    const languageCode = getActiveLocaleCode().substring(0, 2);
    const slugsByLanguageAndByWeek = articleSlugsByLanguageAndByWeek[languageCode];

    /* Load articles */

    const [/** @type {ThirdPartyArticle[]} */ articlesByWeek, setArticlesByWeek] = useState({});
    useEffect(() => {
        /**
         * @param {string[]} slugs
         * @returns {Promise<ThirdPartyArticle[]>}
         */
        function loadArticlesForOneWeek(slugs) {
            return Promise.all(slugs.map(slug => import('../third-party-content/' + languageCode + '/' + slug + '.mjs')));
        }

        async function loadArticlesForAllWeeks() {
            /** @type {{weekIndex: string, articles: ThirdPartyArticle[]}[]} */
            const articlePromisesForEachWeek = Object.entries(slugsByLanguageAndByWeek).map(async ([weekIndex, slugs]) => ({weekIndex, articles: await loadArticlesForOneWeek(slugs)}));
            /** @type {Object<int, ThirdPartyArticle[]>} */
            const articlesForEachWeek = (await Promise.all(articlePromisesForEachWeek)).reduce((object, {weekIndex, articles}) => ({...object, [weekIndex]: articles}), {});
            setArticlesByWeek(articlesForEachWeek);
        }

        loadArticlesForAllWeeks().then(() => {});
        document.title = __('Articles about photography') + ' - Photato';
    }, []);

    return <>
        <h1>{__('Articles about photography')}</h1>
        <p>{__('On this page we list articles that we found useful. [...]')}</p>
        {Object.keys(articlesByWeek).length
            ? Object.entries(articlesByWeek).map(([weekIndex, articles]) => renderOneWeek(Number.parseInt(weekIndex), articles))
            :
            <p>{__('Loading articles...')}</p>}
    </>;

    /**
     * @param {int} weekIndex
     * @param {ThirdPartyArticle[]} articles
     * @returns {React.ReactElement[]|null}
     */
    function renderOneWeek(weekIndex, articles) {
        return articles.length ? <>
            <h2>{__(weeklyChallengeTitles[weekIndex - 1])}</h2>
            <ul>{articles.map(renderArticleToListElement)}</ul>
        </> : null;
    }

    /**
     * @param {ThirdPartyArticle} article
     */
    function renderArticleToListElement(article) {
        const metadata = article.getMetadata();
        return <li className={metadata.isOriginalUrlBroken ? 'broken' : ''}>
            [<NavLink to={'/external-article/' + metadata.slug}>{__('Photato cached version')}</NavLink>]&nbsp;
            <ExternalLink href={metadata.originalUrl}
               className={metadata.isOriginalUrlBroken ? 'brokenLink' : ''}>{metadata.publisherName + ': ' + metadata.title}</ExternalLink>
            {metadata.isOriginalUrlBroken && ' – az eredeti cikk már nem elérhető'}
        </li>;
    }
}