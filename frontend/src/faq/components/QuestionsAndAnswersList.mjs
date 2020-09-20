import React from '../../web_modules/react.js';
import QuestionAndAnswer from './QuestionAndAnswer.mjs';

/**
 * @param {{id: string, question: Component, answer: Component}[]} questionsAndAnswers
 * @returns {Component}
 * @constructor
 */
export default function QuestionsAndAnswersList({questionsAndAnswers}) {
    return <dl className="faqList">
        {questionsAndAnswers.map(questionAndAnswer =>
            <QuestionAndAnswer id={questionAndAnswer.id}
                               question={questionAndAnswer.question}
                               answer={questionAndAnswer.answer}
                               key={questionAndAnswer.id}/>)}
    </dl>;
}