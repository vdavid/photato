import React, {useEffect, useState} from 'react';
import {useI18n} from '../../i18n/components/I18nProvider';
import {useParams, useRouteMatch} from 'react-router-dom';

import NavLinkButton from '../../website/components/NavLinkButton';
import MaterialContextProvider from './MaterialContextProvider';
import type {ArticleMetadata, LoadedArticle} from '../types';

interface ArticleState {
    isLoaded: boolean;
    metadata: ArticleMetadata | Record<string, never>;
    component: React.ComponentType | null;
}

export default function MaterialPage() {
    /* Get page parameters */
    const {slug, languageCode} = useParams<{slug: string; languageCode: string}>();
    const isExternalArticle = useRouteMatch<{folder: string}>(`/${languageCode}/:folder/${slug}`)!.params['folder'] === 'external-article';

    const {getActiveLocaleCode, __} = useI18n();

    const [article, setArticle] = useState<ArticleState>({isLoaded: false, metadata: {}, component: null});

    /* Load article */
    useEffect(() => {
        setArticle({isLoaded: false, metadata: {}, component: null});

        async function loadArticle() {
            const content = await import((`../${isExternalArticle ? 'third-party' : 'own'}-content/${languageCode}/${slug}.tsx`)) as LoadedArticle;
            const importedArticle = {isLoaded: true, metadata: content.getMetadata(), component: content.default};
            setArticle(importedArticle);
            document.title = importedArticle.metadata.title + ' - Photato';
        }

        loadArticle().then(() => {});
    }, [slug]);

    const metadata = article.metadata as ArticleMetadata;
    const Component = article.component as React.ComponentType;

    return article.isLoaded ?
        <MaterialContextProvider metadata={metadata}>
            <p>
                <NavLinkButton to='/materials'>{'←' + __('Back to the list of materials')}</NavLinkButton>
            </p>
            <article>
                <header>
                    <h1>{metadata.title}</h1>
                    <p className='metadata articleMetadata'>{__('Author') + ': ' + metadata.author} — {__('Publication date') + ': ' + metadata.publishDate.toLocaleDateString(getActiveLocaleCode())}{metadata.originalUrl ? <> — <a href={metadata.originalUrl} target='_blank'>{__('Original article')}</a></> : ''}
                    </p>
                </header>
                <Component/>
            </article>
            <p>
                {!isExternalArticle && <NavLinkButton to='/upload'>{__('Upload your best photo')}</NavLinkButton>}
                <NavLinkButton to='/materials'>{'←' + __('Back to the list of materials')}</NavLinkButton>
            </p>
        </MaterialContextProvider>
        : <>
            {__('Loading article...')}
            <p>
                <NavLinkButton to='/materials'>{'←' + __('Back to the list of materials')}</NavLinkButton>
            </p>
        </>;
}