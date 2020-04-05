import {createElement, useEffect, useState} from '../../web_modules/react.js';
import {useParams} from '../../web_modules/react-router-dom.js';

export default function ChallengePage() {
    const [pageContentHtml, setPageContentHtml] = useState(null);
    const {weekIndex} = useParams();

    async function fetchPageContent() {
        const response = await fetch('/challenges/challenge-htmls/week' + weekIndex + '.html', {mode: 'no-cors'});
        const html = await response.text();
        setPageContentHtml(html);
    }

    useEffect(() => {
        setPageContentHtml(null);
        // noinspection JSIgnoredPromiseFromCall
        fetchPageContent();
    }, [weekIndex]);

    return createElement("div", {dangerouslySetInnerHTML: {__html: pageContentHtml}});
}