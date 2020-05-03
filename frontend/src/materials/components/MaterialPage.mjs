import React, {useEffect, useState} from '../../web_modules/react.js';
import {useI18n} from '../../i18n/components/I18nProvider.mjs';
import {useParams} from '../../web_modules/react-router-dom.js';

import NavLinkButton from '../../website/components/NavLinkButton.mjs';
import MaterialContextProvider from './MaterialContextProvider.mjs';

export default function MaterialPage() {
    /* Get page parameters */
    const {slug} = useParams();

    const {getActiveLocaleCode, __} = useI18n();
    const languageCode = getActiveLocaleCode().substring(0, 2);

    const [article, setArticle] = useState({isLoaded: false, metadata: {}, component: null});

    /* Load article */
    useEffect(() => {
        setArticle({isLoaded: false, metadata: {}, component: null});

        async function loadArticle() {
            const content = await import('../content/' + languageCode + '/' + slug + '.mjs');
            const importedArticle = {isLoaded: true, metadata: content.getMetadata(), component: content.default};
            setArticle(importedArticle);
            document.title = importedArticle.metadata.title + ' - Photato';
        }

        loadArticle().then(() => {});
    }, [slug]);

    return article.isLoaded ?
        <MaterialContextProvider metadata={article.metadata}>
            <NavLinkButton to='/materials'>{'←' + __('Back to the list of materials')}</NavLinkButton>
            <article>
                <header>
                    <h1>{article.metadata.title}</h1>
                    <p className='metadata articleMetadata'>{__('Author') + ': ' + article.metadata.author} — {__('Publication date') + ': ' + article.metadata.publishDate.toLocaleDateString(getActiveLocaleCode())} — <a href={article.metadata.originalUrl} target='_blank'>{__('Original article')}</a>
                    </p>
                </header>
                <article.component/>
            </article>
            <NavLinkButton to='/materials'>{'←' + __('Back to the list of materials')}</NavLinkButton>
        </MaterialContextProvider>
        : <>
            {__('Loading article...')}
            <NavLinkButton to='/materials'>{'←' + __('Back to the list of materials')}</NavLinkButton>
        </>;
}