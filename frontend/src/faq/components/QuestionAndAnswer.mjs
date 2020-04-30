import React from '../../web_modules/react.js';

/**
 * @param {string} id
 * @param {Component} question
 * @param {Component} answer
 * @returns {Component}
 * @constructor
 */
export default function QuestionAndAnswer({id, question, answer}) {
    return <div id={id}>
        <dt>🅠: {question}</dt>
        <dd>🅐: {answer}</dd>
    </div>;
}