import type React from 'react';

/** Metadata each article module returns from its `getMetadata()` export. */
export interface ArticleMetadata {
    slug: string;
    title: string;
    author: string;
    publishDate: Date;
    publisherName: string;
    /** Only applicable for external (third-party) articles. */
    originalUrl?: string;
    /** Only applicable for external (third-party) articles. */
    isOriginalUrlBroken?: boolean;
}

/** The shape of a dynamically imported article module. */
export interface LoadedArticle {
    getMetadata: () => ArticleMetadata;
    default: React.ComponentType;
}
