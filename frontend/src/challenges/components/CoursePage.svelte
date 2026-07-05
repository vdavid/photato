<script lang="ts">
    import {__, getActiveLocaleCode} from '../../i18n/i18n.svelte';
    import {config} from '../../config';
    import {weeklyChallengeTitles} from '../challengeRepository';
    import {courseData} from '../courseData';
    import Link from '../../website/components/Link.svelte';
    import NavLinkButton from '../../website/components/NavLinkButton.svelte';
    import {formatDateWithWeekDay, formatDateWithWeekDayAndTime} from '../../website/dateTimeHelper';
    import ExternalLink from '../../materials/components/ExternalLink.svelte';

    const {currentWeekIndex, currentDayIndex, weekCount, courseStartDate, getDeadline} = courseData;
    const currentWeekIndexButAtLeastOne = Math.max(currentWeekIndex, 1);
    const weekIndexes = Array.from(Array(Math.max(Math.min(currentWeekIndexButAtLeastOne, weekCount), 0)), (value, key) => key + 1);

    const today = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
    const currentWeekIndexAdjustedForFirstDay = today.getTime() !== courseStartDate.getTime() ? currentWeekIndex : 1;

    $effect(() => {document.title = config.course.titleWithoutPhotato + ' - Photato';});
</script>

<h1>{config.course.titleWithPhotato}</h1>
{#if currentWeekIndexAdjustedForFirstDay >= 1}
    <p>{__('The course started {approximateWeeksAgo} ({exactDate}).', {
        approximateWeeksAgo: (currentWeekIndex > 1) ? __('about {weekIndex} weeks ago', {weekIndex: currentWeekIndex}) : __('recently'),
        exactDate: formatDateWithWeekDay(courseStartDate, getActiveLocaleCode()),
    })}</p>

    {#if currentWeekIndex <= weekCount}
        <h2>{__('This week’s challenge')}</h2>
        <p>
            <Link to={'/challenges/' + currentWeekIndexAdjustedForFirstDay}>
                {__('Week {weekIndex}:', {weekIndex: currentWeekIndexAdjustedForFirstDay}) + ' ' + __(weeklyChallengeTitles[currentWeekIndexAdjustedForFirstDay - 1])}
            </Link> – {__('Deadline to submit your shot')}: <strong>{formatDateWithWeekDayAndTime(getDeadline(currentWeekIndexAdjustedForFirstDay), getActiveLocaleCode())}</strong>
        </p>
        <h2>{__('Materials')}</h2>
        <p>{__('Make sure you read this week’s tips. Check out the materials for the current and previous weeks right here:')}&nbsp;
            <Link to="/materials">{__('Materials')}</Link>
        </p>
        <p>
            <NavLinkButton to="/upload">{__('Upload your best photo')}</NavLinkButton>
        </p>
        <h2>{__('Community')}</h2>
        {#if getActiveLocaleCode() === 'hu-HU'}
            <p>Együtt tanulni általában könnyebb és viccesebb, mint külön. Ha használsz Facebookot, nézz be a <ExternalLink href={config.course.facebookGroupUrl}>csoportba</ExternalLink>, ahol beszélgethetsz a többiekkel, hasznos tippeket és extra infókat kaphatsz. Emellett segíthetsz is másoknak: nem kell profi fotósnak lenned, gyakran a laikus vélemény is sokat ad. Ráädásul amikor tippekkel segítesz másoknak, abból is csomót tanulsz. Várunk a csoportban! 😊
            </p>
        {:else}
            <p>TODO</p>
        {/if}
    {:else}
        <p>{__('Unfortunately, it’s already over. But you can sign up to the next course if you still want to study photography.')}</p>
        <p>
            <ExternalLink href={config.course.signUpFormUrl} class="callToActionButton">{__('Sign up for the next course')}</ExternalLink>
        </p>
    {/if}

    {#if currentWeekIndex > 1}
        <h2>{__('Previous challenges')}</h2>
        {#each weekIndexes as weekIndex (weekIndex)}
            <p>
                <Link to={'/challenges/' + weekIndex}>
                    {__('Week {weekIndex}:', {weekIndex}) + ' ' + __(weeklyChallengeTitles[weekIndex - 1])}
                </Link>
            </p>
        {/each}
    {/if}
{:else}
    <p>{__('The course hasn’t started. It’ll start in only {dayCount} days, on {exactDate}!', {dayCount: Math.abs(currentDayIndex), exactDate: formatDateWithWeekDay(courseStartDate, getActiveLocaleCode())})}</p>
    <p>{__('If you’ve signed up, you’ll get an email on the next steps in {dayCount} days.', {dayCount: Math.abs(currentDayIndex)})}</p>
    <p>{__('In case you haven’t')}:</p>
    <p>
        <ExternalLink href={config.course.signUpFormUrl} class="main callToActionButton">{__('Sign up for the next course')}</ExternalLink>
    </p>
{/if}
