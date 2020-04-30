import React from '../../web_modules/react.js';
import QuestionAndAnswer from './QuestionAndAnswer.mjs';

/**
 * @param {{question: string|Component, answer: string|Component}[]} questionsAndAnswers
 * @returns {Component}
 * @constructor
 */
export default function QuestionsAndAnswersList({questionsAndAnswers}) {
    return <dl className="faqList">
        {questionsAndAnswers.map(questionAndAnswer => <QuestionAndAnswer question={questionAndAnswer.question} answer={questionAndAnswer.answer} />)}
    </dl>;
}