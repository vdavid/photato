<script lang="ts">
    import type {Component} from 'svelte';
    import {__, getActiveLocaleCode} from '../../i18n/i18n.svelte';
    import {auth} from '../../auth/auth.svelte';
    import {courseData} from '../courseData';
    import {weeklyChallengeTitles} from '../challengeRepository';
    import {formatDateWithWeekDayAndTime} from '../../website/dateTimeHelper';
    import Link from '../../website/components/Link.svelte';
    import NavLinkButton from '../../website/components/NavLinkButton.svelte';
    import Error404Page from '../../website/components/Error404Page.svelte';

    type ChallengeComponentType = Component<{formattedDeadline: string; baseUrl: string}>;

    let {weekIndex}: {weekIndex: string} = $props();
    let weekIndexAsNumber = $derived(Number(weekIndex));

    const {currentWeekIndex, getDeadline} = courseData;
    const languageCode = getActiveLocaleCode().substring(0, 2);
    let formattedDeadline = $derived(formatDateWithWeekDayAndTime(getDeadline(weekIndex), getActiveLocaleCode()));

    let ChallengeComponent = $state<ChallengeComponentType | null>(null);
    let isLoaded = $state(false);
    let failedToTranslate = $state(false);

    $effect(() => {
        if (weekIndexAsNumber >= 1 && currentWeekIndex >= weekIndexAsNumber) {
            const currentWeekIndexToLoad = weekIndex;
            isLoaded = false;
            failedToTranslate = false;
            ChallengeComponent = null;
            void (async () => {
                try {
                    ChallengeComponent = (await import(`../content/${languageCode}/Week${currentWeekIndexToLoad}Challenge.svelte`)).default;
                } catch {
                    failedToTranslate = true;
                }
                isLoaded = true;
            })();
            document.title = __('Week {weekIndex}:', {weekIndex}) + ' ' + __(weeklyChallengeTitles[weekIndexAsNumber - 1]) + ' - Photato';
        }
    });
</script>

{#if weekIndexAsNumber >= 1 && currentWeekIndex >= weekIndexAsNumber}
    <article>
        <h1>{__('Week {weekIndex}:', {weekIndex}) + ' ' + __(weeklyChallengeTitles[weekIndexAsNumber - 1])}</h1>
        {#if isLoaded}
            <div>
                {#if failedToTranslate || !ChallengeComponent}
                    <p>{__('Sorry, this challenge hasn’t been translated to your language yet.')}</p>
                {:else}
                    {@const Challenge = ChallengeComponent}
                    <Challenge {formattedDeadline} baseUrl=""/>
                {/if}
            </div>
        {:else}
            <p>{__('Loading challenge...')}</p>
        {/if}
        <p>{__('We’ve collected many useful resources for you to make the most out of this challenge. You can find them here:')} <Link to="/materials">{__('Materials')}</Link></p>
        {#if parseInt(weekIndex) === currentWeekIndex}
            <NavLinkButton to="/upload" disabled={!auth.isAuthenticated} title={!auth.isAuthenticated ? __('You’ll need to sign in to upload a photo.') : ''}>
                {__('Upload your weekly photo')}
            </NavLinkButton>
        {/if}
        <NavLinkButton to="/course">{'← ' + __('Back to the course page')}</NavLinkButton>
    </article>
{:else}
    <Error404Page/>
{/if}
