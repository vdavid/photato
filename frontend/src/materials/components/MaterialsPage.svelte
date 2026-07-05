<script lang="ts">
    import {onMount} from 'svelte';
    import {config} from '../../config';
    import {__, getActiveLocaleCode} from '../../i18n/i18n.svelte';
    import {courseData} from '../../challenges/courseData';
    import Link from '../../website/components/Link.svelte';
    import {weeklyChallengeTitles} from '../../challenges/challengeRepository';
    import {ownArticleSlugsByLanguageAndByWeek, thirdPartyArticleSlugsByLanguageAndByWeek} from '../articles-repository';
    import ExternalLink from './ExternalLink.svelte';
    import type {LoadedArticle} from '../types';

    type ArticlesByWeek = Record<number, LoadedArticle[]>;

    const languageCode = getActiveLocaleCode().substring(0, 2);
    const ownSlugsByWeek = (ownArticleSlugsByLanguageAndByWeek as Record<string, Record<number, string[]>>)[languageCode];
    const thirdPartySlugsByWeek = (thirdPartyArticleSlugsByLanguageAndByWeek as Record<string, Record<number, string[]>>)[languageCode];

    let ownArticlesByWeek = $state<ArticlesByWeek>({});
    let thirdPartyArticlesByWeek = $state<ArticlesByWeek>({});

    function loadArticlesForOneWeek(slugs: string[], ownership: 'own' | 'third-party'): Promise<LoadedArticle[]> {
        return Promise.all(slugs.map(slug =>
            (ownership === 'own'
                ? import(`../own-content/${languageCode}/${slug}.svelte`)
                : import(`../third-party-content/${languageCode}/${slug}.svelte`)) as Promise<LoadedArticle>));
    }

    onMount(async () => {
        const ownPromises = Object.entries(ownSlugsByWeek)
            .map(async ([weekIndex, slugs]) => ({weekIndex, articles: await loadArticlesForOneWeek(slugs, 'own')}));
        const thirdPartyPromises = Object.entries(thirdPartySlugsByWeek)
            .map(async ([weekIndex, slugs]) => ({weekIndex, articles: await loadArticlesForOneWeek(slugs, 'third-party')}));
        ownArticlesByWeek = (await Promise.all(ownPromises))
            .reduce<ArticlesByWeek>((object, {weekIndex, articles}) => ({...object, [parseInt(weekIndex)]: articles}), {});
        thirdPartyArticlesByWeek = (await Promise.all(thirdPartyPromises))
            .reduce<ArticlesByWeek>((object, {weekIndex, articles}) => ({...object, [parseInt(weekIndex)]: articles}), {});
    });

    $effect(() => {document.title = __('Articles about photography') + ' - Photato';});

    let isLoaded = $derived(Object.keys(ownArticlesByWeek).length > 0 && Object.keys(thirdPartyArticlesByWeek).length > 0);
    let currentWeek = $derived(Math.min(Math.floor(courseData.currentDayIndex / 7) + 1, config.course.weekCount));
    let weekIndexes = $derived(currentWeek >= 1 ? [...Array(currentWeek + 1).keys()].slice(1) : []);

    function articlesForWeek(weekIndex: number): LoadedArticle[] {
        return [...(ownArticlesByWeek[weekIndex] ?? []), ...(thirdPartyArticlesByWeek[weekIndex] ?? [])];
    }
</script>

<h1>{__('Articles about photography')}</h1>
<p>{@html __('Some of these articles are not our own. [...]')}</p>

{#if !isLoaded}
    <p>{__('Loading articles...')}</p>
{:else if currentWeek >= 1}
    {#each weekIndexes as weekIndex (weekIndex)}
        {@const articles = articlesForWeek(weekIndex)}
        {#if articles.length}
            <div>
                <h2>{__('Week #{weekIndex}', {weekIndex})} – {__(weeklyChallengeTitles[weekIndex - 1])}</h2>
                <ul>
                    {#each articles as article (article.getMetadata().slug)}
                        {@const metadata = article.getMetadata()}
                        {#if metadata.publisherName === 'Photato'}
                            <li class="own">
                                <Link to={'/' + languageCode + '/article/' + metadata.slug}>{metadata.title}</Link> ({__('Photato article')})
                            </li>
                        {:else}
                            <li class={metadata.isOriginalUrlBroken ? 'thirdParty broken' : 'thirdParty'}>
                                [<Link to={'/' + languageCode + '/external-article/' + metadata.slug}>{@html __('Photato cached version')}</Link>]&nbsp;{#if !metadata.isOriginalUrlBroken}<ExternalLink href={metadata.originalUrl}>{metadata.publisherName + ': ' + metadata.title}</ExternalLink>{:else}{metadata.publisherName + ': ' + metadata.title}{/if}{#if metadata.isOriginalUrlBroken}{' – ' + __('the original article is not available anymore 😞')}{/if}
                            </li>
                        {/if}
                    {/each}
                </ul>
            </div>
        {/if}
    {/each}
{:else}
    <h2>{__('Week #{weekIndex}', {weekIndex: 1})} – ???</h2>
    <p>{__('The course hasn’t started. Helpful articles will be added here as the course progresses. Check back later!')}</p>
{/if}
