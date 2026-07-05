import React from 'react';
import QuestionAndAnswer from './QuestionAndAnswer';
import type {SingleLanguageQuestionAndAnswer} from '../faqContent';

interface QuestionsAndAnswersListProps {
    questionsAndAnswers: SingleLanguageQuestionAndAnswer[];
}

export default function QuestionsAndAnswersList({questionsAndAnswers}: QuestionsAndAnswersListProps) {
    return <dl className="faqList">
        {questionsAndAnswers.map(questionAndAnswer =>
            <QuestionAndAnswer id={questionAndAnswer.id}
                               question={questionAndAnswer.question}
                               answer={questionAndAnswer.answer}
                               key={questionAndAnswer.id}/>)}
    </dl>;
}