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
    return <div className="faqItem" id={id}>
        <Twemoji>
            <dt><strong>🅠: {question}</strong></dt>
            <dd>🅐: {answer}</dd>
        </Twemoji>
    </div>;
}