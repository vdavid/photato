import {articleSlugsByLanguage} from '../external-articles-repository.mjs';
import {createElement, useState, useEffect} from '../../web_modules/react.js';
import {useI18n} from '../../i18n/components/I18nProvider.mjs';
import {NavLink} from '../../web_modules/react-router-dom.js';

/**
 * @typedef {Object} ArticleMetadata
 * @property {string} slug
 * @property {string} title
 * @property {string|null} author
 * @property {Date} publishDate
 * @property {string} publisherName
 * @property {string} originalUrl
 * @property {boolean} isOriginalUrlBroken
 */
/**
 * @typedef {Object} ThirdPartyArticle
 * @property {function(): ArticleMetadata} getMetadata
 * @property {function(): string} getContent
 */

export default function MaterialsPage() {
    const {getActiveLocaleCode, __} = useI18n();

    const languageCode = getActiveLocaleCode().substring(0, 2);
    const slugs = articleSlugsByLanguage[languageCode];

    /* Load articles */

    const [/** @type {ThirdPartyArticle[]} */ articles, setArticles] = useState([]);
    useEffect(() => {
        async function loadArticles() {
            setArticles(await Promise.all(slugs.map(slug => import('../content/' + languageCode + '/' + slug + '.mjs'))));
        }

        loadArticles().then(() => {});
    }, []);

    return [
        createElement('h1', {}, __('Articles about photography')),
        createElement('p', {
            dangerouslySetInnerHTML: {
                __html: __(`On this page we list articles that we found useful.<br />
        <em>We didn't write these articles.</em> We just like them very much.<br />
        Sadly, these great articles tend to disappear from the internet over the years. To protect them, we created cached copies for some.<br />
        Unless the link is broken, we advise you to <em>read the original version</em> to support its authors with your visit and ad views.`)
            }
        }),
        articles.length
            ? createElement('ul', {}, articles.map(renderArticleToListElement))
            : __('Loading articles...'),
    ];

    /**
     * @param {ThirdPartyArticle} article
     */
    function renderArticleToListElement(article) {
        const metadata = article.getMetadata();
        return createElement('li', {className: metadata.isOriginalUrlBroken ? 'broken' : ''}, [
            createElement('a', {href: metadata.originalUrl, target: '_blank'}, metadata.title),
            ' [',
            createElement(NavLink, {to: '/external-article/' + metadata.slug}, __('Cached version on Photato')),
            ']'
        ]);
    }
}