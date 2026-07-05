import React from 'react';
import Twemoji from '../../website/components/Twemoji.jsx';

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