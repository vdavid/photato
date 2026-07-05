import {getContext, setContext} from 'svelte';
import type {ArticleMetadata} from '../types';

/* Article metadata shared from MaterialPage down to the figure components (which build image URLs from
 * the article slug). Provided as a getter so it stays reactive as the loaded article changes. */

const MATERIAL_CONTEXT_KEY = Symbol('materialContext');

export function setMaterialContext(getMetadata: () => ArticleMetadata): void {
    setContext(MATERIAL_CONTEXT_KEY, getMetadata);
}

export function getMaterialContext(): () => ArticleMetadata {
    return getContext(MATERIAL_CONTEXT_KEY);
}
