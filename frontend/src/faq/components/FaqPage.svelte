<script lang="ts">
    import {config} from '../../config';
    import {__, getActiveLocaleCode} from '../../i18n/i18n.svelte';
    import QuestionsAndAnswersList from './QuestionsAndAnswersList.svelte';
    import {getSingleLanguageContent} from '../faqContent';
    import ExternalLink from '../../materials/components/ExternalLink.svelte';

    const languageCode = getActiveLocaleCode().substring(0, 2);
    const questionsAndAnswers = getSingleLanguageContent(languageCode);

    $effect(() => {document.title = __('Frequently asked questions') + ' - Photato';});
</script>

<h1>{__('Frequently asked questions')}</h1>
<div class="faqSummary">
    <ul>
        {#each questionsAndAnswers as questionAndAnswer (questionAndAnswer.id)}
            <li><a href={'#' + questionAndAnswer.id}>{@html questionAndAnswer.question}</a></li>
        {/each}
    </ul>
</div>
<QuestionsAndAnswersList {questionsAndAnswers}/>
<p>
    <ExternalLink href={config.course.signUpFormUrl} class="callToActionButton">{__('Sign up for the next course')} →</ExternalLink>
</p>
