import type { Component } from 'svelte'

/** Metadata each article module returns from its `getMetadata()` export. */
export interface ArticleMetadata {
  slug: string
  title: string
  author: string
  publishDate: Date
  publisherName: string
  /** Only applicable for external (third-party) articles. */
  originalUrl?: string
  /** Only applicable for external (third-party) articles. */
  isOriginalUrlBroken?: boolean
}

/** The shape of a dynamically imported article module: a `<script module>` `getMetadata` export plus
 * the Svelte component as the default export. */
export interface LoadedArticle {
  getMetadata: () => ArticleMetadata
  default: Component
}
