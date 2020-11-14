import React, {useState, useEffect} from '../../web_modules/react.js';
import {config} from '../../config.mjs';
import {useI18n} from '../../i18n/components/I18nProvider.mjs';
import {useCourseData} from '../../challenges/components/CourseDataProvider.mjs';
import {NavLink} from '../../web_modules/react-router-dom.js';
import {weeklyChallengeTitles} from '../../challenges/challengeRepository.mjs';
import {ownArticleSlugsByLanguageAndByWeek, thirdPartyArticleSlugsByLanguageAndByWeek} from '../articles-repository.mjs';
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
 */
/**
 * @typedef {Object} LoadedArticle
 * @property {function(): ArticleMetadata} getMetadata
 * @property {function(): string} getContent
 */

export default function MaterialsPage() {
    const {getActiveLocaleCode, __} = useI18n();
    const {currentDayIndex} = useCourseData();

    const languageCode = getActiveLocaleCode().substring(0, 2);
    const ownSlugsByLanguageAndByWeek = ownArticleSlugsByLanguageAndByWeek[languageCode];
    const thirdPartySlugsByLanguageAndByWeek = thirdPartyArticleSlugsByLanguageAndByWeek[languageCode];

    /* Load articles */

    const [/** @type {Object<int, LoadedArticle[]>} */ ownArticlesByWeek, setOwnArticlesByWeek] = useState({});
    const [/** @type {Object<int, LoadedArticle[]>} */ thirdPartyArticlesByWeek, setThirdPartyArticlesByWeek] = useState({});
    useEffect(() => {
        /**
         * @param {string[]} slugs
         * @param {"own"|"third-party"} ownership
         * @returns {Promise<LoadedArticle[]>}
         */
        function loadArticlesForOneWeek(slugs, ownership) {
            return Promise.all(slugs.map(slug => import((`../${ownership}-content/${languageCode}/${slug}.mjs`))));
        }

        async function loadArticlesForAllWeeks() {
            /** @type {{weekIndex: string, articles: LoadedArticle[]}[]} */
            const ownArticlePromisesForEachWeek = Object.entries(ownSlugsByLanguageAndByWeek)
                .map(async ([weekIndex, slugs]) => ({weekIndex, articles: await loadArticlesForOneWeek(slugs, 'own')}));
            /** @type {{weekIndex: string, articles: LoadedArticle[]}[]} */
            const thirdPartyArticlePromisesForEachWeek = Object.entries(thirdPartySlugsByLanguageAndByWeek)
                .map(async ([weekIndex, slugs]) => ({weekIndex, articles: await loadArticlesForOneWeek(slugs, 'third-party')}));
            /** @type {Object<int, LoadedArticle[]>} */
            const ownArticlesForEachWeek = (await Promise.all(ownArticlePromisesForEachWeek))
                .reduce((object, {weekIndex, articles}) => ({...object, [parseInt(weekIndex)]: articles}), {});
            const thirdPartyArticlesForEachWeek = (await Promise.all(thirdPartyArticlePromisesForEachWeek))
                .reduce((object, {weekIndex, articles}) => ({...object, [parseInt(weekIndex)]: articles}), {});
            setOwnArticlesByWeek(ownArticlesForEachWeek);
            setThirdPartyArticlesByWeek(thirdPartyArticlesForEachWeek);
        }

        loadArticlesForAllWeeks().then(() => {});
        document.title = __('Articles about photography') + ' - Photato';
    }, []);

    return <>
        <h1>{__('Articles about photography')}</h1>
        <p>{__('Some of these articles are not our own. [...]')}</p>
        {renderList()}
    </>;

    function renderList() {
        if (Object.keys(ownArticlesByWeek).length && Object.keys(thirdPartyArticlesByWeek).length) {
            const currentWeekIndexWithBoundariesAndSunday = Math.min(Math.floor(currentDayIndex / 7) + 1, config.course.weekCount);
            if (currentWeekIndexWithBoundariesAndSunday >= 1) {
                const weekIndexes = [...Array(currentWeekIndexWithBoundariesAndSunday + 1).keys()].slice(1);
                return weekIndexes.map(weekIndex => renderOneWeek(weekIndex, [...ownArticlesByWeek[weekIndex], ...thirdPartyArticlesByWeek[weekIndex]]))
            } else {
                return <>
                    <h2>{__('Week #{weekIndex}', {weekIndex: 1})} – ???</h2>
                    <p>{__('The course hasn’t started. Helpful articles will be added here as the course progresses. Check back later!')}</p>
                </>;
            }
        } else {
            return <p>{__('Loading articles...')}</p>;
        }
    }

    /**
     * @param {int} weekIndex One-based
     * @param {LoadedArticle[]} articles
     * @returns {React.ReactElement[]|null}
     */
    function renderOneWeek(weekIndex, articles) {
        return articles.length ? <div key={weekIndex}>
            <h2>{__('Week #{weekIndex}', {weekIndex})} – {__(weeklyChallengeTitles[weekIndex - 1])}</h2>
            <ul>{articles.map(renderArticleToListElement)}</ul>
        </div> : null;
    }

    /**
     * @param {LoadedArticle} article
     */
    function renderArticleToListElement(article) {
        const metadata = article.getMetadata();
        if (article.getMetadata().publisherName === 'Photato') {
            return <li className="own" key={metadata.slug}>
                <NavLink to={'/' + languageCode + '/article/' + metadata.slug}>{metadata.title}</NavLink>
            </li>;
        } else {
            return <li className={metadata.isOriginalUrlBroken ? 'thirdParty broken' : 'thirdParty'} key={metadata.slug}>
                [<NavLink to={'/' + languageCode + '/external-article/' + metadata.slug}>{__('Photato cached version')}</NavLink>]&nbsp;
                <ExternalLink href={metadata.originalUrl}
                              className={metadata.isOriginalUrlBroken ? 'brokenLink' : ''}>{metadata.publisherName + ': ' + metadata.title}</ExternalLink>
                {metadata.isOriginalUrlBroken && ' – az eredeti cikk már nem elérhető'}
            </li>;
        }
    }
}