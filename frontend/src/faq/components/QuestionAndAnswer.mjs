import React from '../../web_modules/react.js';

/**
 * @param {string|Component} question
 * @param {string|Component} answer
 * @returns {Component}
 * @constructor
 */
export default function QuestionAndAnswer({question, answer}) {
    return <>
        <dt>🅠: {question}</dt>
        <dd>🅐: {answer}</dd>
    </>;
}