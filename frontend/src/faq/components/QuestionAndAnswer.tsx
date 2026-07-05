import React from 'react';
import Twemoji from '../../website/components/Twemoji';
import type {SingleLanguageQuestionAndAnswer} from '../faqContent';

export default function QuestionAndAnswer({id, question, answer}: SingleLanguageQuestionAndAnswer) {
    return <div className="faqItem" id={id}>
        <Twemoji>
            <dt><strong>🅠: {question}</strong></dt>
            <dd>🅐: {answer}</dd>
        </Twemoji>
    </div>;
}