<script lang="ts">
    import type { SingleLanguageQuestionAndAnswer } from '../faqContent'

    const { id, question, answer }: SingleLanguageQuestionAndAnswer = $props()
</script>

<div class="faqItem" {id}>
    <!-- eslint-disable svelte/no-at-html-tags -- trusted: renders our own FAQ question/answer content, not user input -->
    <dt><strong>🅠: {@html question}</strong></dt>
    <dd>🅐: {@html answer}</dd>
    <!-- eslint-enable svelte/no-at-html-tags -->
</div>
