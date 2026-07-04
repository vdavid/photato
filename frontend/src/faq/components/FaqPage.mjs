import React, {useEffect} from '../../web_modules/react.js';
import {config} from '../../config.mjs';
import {useI18n} from '../../i18n/components/I18nProvider.mjs';
import QuestionsAndAnswersList from './QuestionsAndAnswersList.mjs';
import {getSingleLanguageContent} from '../faqContent.mjs';
import ExternalLink from '../../materials/components/ExternalLink.mjs';

export default function FaqPage() {
    const {getActiveLocaleCode, __} = useI18n();
    const languageCode = getActiveLocaleCode().substring(0, 2);

    const questionsAndAnswers = getSingleLanguageContent(languageCode);

    useEffect(() => {document.title = __('Frequently asked questions') + ' - Photato'}, []);

    return <>
        <h1>{__('Frequently asked questions')}</h1>
        <div className="faqSummary">
            <ul>
                {getTocItems(questionsAndAnswers)}
            </ul>
        </div>
        <QuestionsAndAnswersList questionsAndAnswers={questionsAndAnswers}/>
        <p>
            <ExternalLink href={config.course.signUpFormUrl} className="callToActionButton">{__('Sign up for the next course')} →</ExternalLink>
        </p>
    </>;

    function getTocItems(questionsAndAnswers) {
        return questionsAndAnswers.map(questionAndAnswer =>
            <li key={questionAndAnswer.id}>
                <a href={'#' + questionAndAnswer.id}>{questionAndAnswer.question}</a>
            </li>);
    }
}
