import React from '../../web_modules/react.js';
import Twemoji from '../../website/components/Twemoji.mjs';

/**
 * @param {string} id
 * @param {Component} question
 * @param {Component} answer
 * @returns {Component}
 * @constructor
 */
export default function QuestionAndAnswer({id, question, answer}) {
    return <div id={id}>
        <Twemoji>
            <dt>🅠: {question}</dt>
            <dd>🅐: {answer}</dd>
        </Twemoji>
    </div>;
}