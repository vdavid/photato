import {articleSlugsByLanguageAndByWeek} from '../external-articles-repository.mjs';
import React, {useState, useEffect} from '../../web_modules/react.js';
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
    const slugsByLanguageAndByWeek = articleSlugsByLanguageAndByWeek[languageCode];

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
            ? Object.entries(articlesByWeek).map(([weekIndex, articles]) => renderOneWeek(weekIndex, articles))
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
            [<NavLink to={'/external-article/' + metadata.slug}>{__('🥔 cached version')}</NavLink>]&nbsp;
            <a href={metadata.originalUrl}
               target='_blank'
               className={metadata.isOriginalUrlBroken ? 'brokenLink' : ''}>{metadata.publisherName + ': ' + metadata.title}</a>
            {metadata.isOriginalUrlBroken && ' – az eredeti cikk már nem elérhető'}
        </li>;
    }
}