import React from '../../web_modules/react.js';
import {useI18n} from '../../i18n/components/I18nProvider.mjs';
import QuestionsAndAnswersList from './QuestionsAndAnswersList.mjs';
import {getSingleLanguageContent} from '../faqContent.mjs';
import ExternalLink from '../../materials/components/ExternalLink.mjs';

export default function FaqPage() {
    const {getActiveLocaleCode, __} = useI18n();
    const languageCode = getActiveLocaleCode().substring(0, 2);

    return <>
        <h1>{__('Frequently asked questions')}</h1>
        <p><ExternalLink href="https://bit.ly/2tB1hpR">{__('Sign up for the next course')} →</ExternalLink></p>
        <QuestionsAndAnswersList questionsAndAnswers={getSingleLanguageContent(languageCode)} />
        <p><ExternalLink href="https://bit.ly/2tB1hpR">{__('Sign up for the next course')} →</ExternalLink></p>
    </>;
}
