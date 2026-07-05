<script lang="ts">
    import {config} from '../../config';
    import {__} from '../../i18n/i18n.svelte';
    import {weeklyChallengeTitles} from '../challengeRepository';
    import {courseData} from '../courseData';
    import Link from '../../website/components/Link.svelte';

    const weekCount = config.course.weekCount;
    const weekIndexes = Array.from(Array(Math.min(courseData.currentWeekIndex, weekCount)), (value, key) => key + 1);
</script>

<div class="challengeList">
    {#each weekIndexes as weekIndex (weekIndex)}
        <p>
            <Link to={'/challenges/' + weekIndex}>
                {__('Week {weekIndex}:', {weekIndex}) + ' ' + __(weeklyChallengeTitles[weekIndex - 1])}
            </Link>
        </p>
    {/each}
</div>
