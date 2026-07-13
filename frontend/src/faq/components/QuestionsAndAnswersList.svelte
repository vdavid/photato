<script lang="ts">
    import QuestionAndAnswer from './QuestionAndAnswer.svelte'
    import type { SingleLanguageQuestionAndAnswer } from '../faqContent'

    const { questionsAndAnswers }: { questionsAndAnswers: SingleLanguageQuestionAndAnswer[] } = $props()
</script>

<dl class="faqList">
    {#each questionsAndAnswers as questionAndAnswer (questionAndAnswer.id)}
        <QuestionAndAnswer
            id={questionAndAnswer.id}
            question={questionAndAnswer.question}
            answer={questionAndAnswer.answer}
        />
    {/each}
</dl>
