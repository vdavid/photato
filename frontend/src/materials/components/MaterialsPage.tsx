import React, {useState, useEffect} from 'react';
import {config} from '../../config';
import {useI18n} from '../../i18n/components/I18nProvider';
import {useCourseData} from '../../challenges/components/CourseDataProvider';
import {NavLink} from 'react-router-dom';
import {weeklyChallengeTitles} from '../../challenges/challengeRepository';
import {ownArticleSlugsByLanguageAndByWeek, thirdPartyArticleSlugsByLanguageAndByWeek} from '../articles-repository';
import ExternalLink from './ExternalLink';
import type {LoadedArticle} from '../types';

type ArticlesByWeek = Record<number, LoadedArticle[]>;

export default function MaterialsPage() {
    const {getActiveLocaleCode, __} = useI18n();
    const {currentDayIndex} = useCourseData();

    const languageCode = getActiveLocaleCode().substring(0, 2);
    const ownSlugsByLanguageAndByWeek = (ownArticleSlugsByLanguageAndByWeek as Record<string, Record<number, string[]>>)[languageCode];
    const thirdPartySlugsByLanguageAndByWeek = (thirdPartyArticleSlugsByLanguageAndByWeek as Record<string, Record<number, string[]>>)[languageCode];

    /* Load articles */

    const [ownArticlesByWeek, setOwnArticlesByWeek] = useState<ArticlesByWeek>({});
    const [thirdPartyArticlesByWeek, setThirdPartyArticlesByWeek] = useState<ArticlesByWeek>({});
    useEffect(() => {
        function loadArticlesForOneWeek(slugs: string[], ownership: 'own' | 'third-party'): Promise<LoadedArticle[]> {
            return Promise.all(slugs.map(slug => import((`../${ownership}-content/${languageCode}/${slug}.tsx`))));
        }

        async function loadArticlesForAllWeeks() {
            const ownArticlePromisesForEachWeek = Object.entries(ownSlugsByLanguageAndByWeek)
                .map(async ([weekIndex, slugs]) => ({weekIndex, articles: await loadArticlesForOneWeek(slugs, 'own')}));
            const thirdPartyArticlePromisesForEachWeek = Object.entries(thirdPartySlugsByLanguageAndByWeek)
                .map(async ([weekIndex, slugs]) => ({weekIndex, articles: await loadArticlesForOneWeek(slugs, 'third-party')}));
            const ownArticlesForEachWeek = (await Promise.all(ownArticlePromisesForEachWeek))
                .reduce<ArticlesByWeek>((object, {weekIndex, articles}) => ({...object, [parseInt(weekIndex)]: articles}), {});
            const thirdPartyArticlesForEachWeek = (await Promise.all(thirdPartyArticlePromisesForEachWeek))
                .reduce<ArticlesByWeek>((object, {weekIndex, articles}) => ({...object, [parseInt(weekIndex)]: articles}), {});
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

    /** `weekIndex` is one-based. */
    function renderOneWeek(weekIndex: number, articles: LoadedArticle[]) {
        return articles.length ? <div key={weekIndex}>
            <h2>{__('Week #{weekIndex}', {weekIndex})} – {__(weeklyChallengeTitles[weekIndex - 1])}</h2>
            <ul>{articles.map(renderArticleToListElement)}</ul>
        </div> : null;
    }

    function renderArticleToListElement(article: LoadedArticle) {
        const metadata = article.getMetadata();
        if (article.getMetadata().publisherName === 'Photato') {
            return <li className="own" key={metadata.slug}>
                <NavLink to={'/' + languageCode + '/article/' + metadata.slug}>{metadata.title}</NavLink> ({__('Photato article')})
            </li>;
        } else {
            return <li className={metadata.isOriginalUrlBroken ? 'thirdParty broken' : 'thirdParty'} key={metadata.slug}>
                [<NavLink to={'/' + languageCode + '/external-article/' + metadata.slug}>{__('Photato cached version')}</NavLink>]&nbsp;
                {!metadata.isOriginalUrlBroken
                    ? <ExternalLink href={metadata.originalUrl}>{metadata.publisherName + ': ' + metadata.title}</ExternalLink>
                    : metadata.publisherName + ': ' + metadata.title}
                {metadata.isOriginalUrlBroken && ' – ' + __('the original article is not available anymore 😞')}
            </li>;
        }
    }
}