import {config} from '../../config.mjs';
import {createElement, useState, useEffect} from '../../web_modules/react.js';
import {useI18n} from '../../i18n/components/I18nProvider.mjs';
import {useParams} from '../../web_modules/react-router-dom.js';

import NavLinkButton from '../../app/components/NavLinkButton.mjs';
import ArticleElementHelper from '../ArticleElementHelper.mjs';

export default function MaterialPage() {
    /* Get page parameters */
    const {slug} = useParams();

    const {getActiveLocaleCode, __} = useI18n();
    const languageCode = getActiveLocaleCode().substring(0, 2);

    /* Load article */
    const [/** @type {ThirdPartyArticle} */ article, setArticle] = useState(undefined);
    useEffect(() => {
        async function loadArticle() {
            setArticle(await import('../content/' + languageCode + '/' + slug + '.mjs'));
        }

        loadArticle().then(() => {});
    }, []);

    const metadata = article ? article.getMetadata() : {};
    const imageBaseUrl = config.contentImages.externalArticlesBaseUrl + languageCode + '/' + metadata.slug + '/';
    const articleElementHelper = new ArticleElementHelper({imageBaseUrl});
    const contentHtml = article ? article.getContentHtml(articleElementHelper) : '';

    return article ? createElement('article', {},
        createElement('h1', {}, metadata.title),
        createElement('p', {className: 'articleMetadata'}, __('Author') + ': ' + metadata.author, ' — ',
            __('Publication date') + ': ' + metadata.publishDate.toLocaleDateString(getActiveLocaleCode()), ' — ',
            createElement('a', {href: metadata.originalUrl, target: '_blank'}, __('Original article')),
        ),
        createElement('div', {dangerouslySetInnerHTML: {__html: contentHtml}}),
        createElement(NavLinkButton, {to: '/materials'}, '←' + __('Back to the list of materials')),
    ) : [
        __('Loading article...'),
        createElement(NavLinkButton, {to: '/materials'}, '←' + __('Back to the list of materials')),
        ];
}