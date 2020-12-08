import React from '../../../web_modules/react.js';
import FullWidthLocalImage from '../../../challenges/components/FullWidthLocalImage.mjs';

// noinspection JSUnusedGlobalSymbols (This file is loaded dynamically.)
/**
 * @returns {ArticleMetadata}
 */
export function getMetadata() {
    // noinspection SpellCheckingInspection (It's in Hungarian.)
    return {
        slug: 'fotozasblog-digitalis-fotozas-alapok-tippek-trukkok',
        title: 'Digitális fotózás alapjai',
        author: 'Illés Dániel',
        publishDate: new Date('2014-02-08'),
        publisherName: 'fotozasblog.hu',
        originalUrl: 'http://fotozasblog.hu/digitalis-fotozas/',
        isOriginalUrlBroken: false,
    };
}

// noinspection JSUnusedGlobalSymbols (This file is loaded dynamically.)
/**
 * @returns {React.ReactElement}
 */
export default function Article() {
    // noinspection SpellCheckingInspection (It's in Hungarian.)
    return <>
        <FullWidthLocalImage fileName="fotozasblog-digitalis-fotozas-alapok-tippek-trukkok.png" altText="" />
    </>;
}