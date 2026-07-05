<script lang="ts">
    import type {SingleLanguageQuestionAndAnswer} from '../faqContent';

    let {id, question, answer}: SingleLanguageQuestionAndAnswer = $props();
</script>

<div class="faqItem" {id}>
    <dt><strong>🅠: {@html question}</strong></dt>
    <dd>🅐: {@html answer}</dd>
</div>
