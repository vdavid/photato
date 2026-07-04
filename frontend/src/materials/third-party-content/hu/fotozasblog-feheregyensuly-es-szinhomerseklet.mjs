import React from '../../../web_modules/react.js';
import FullWidthLocalImage from '../../../challenges/components/FullWidthLocalImage.mjs';

// noinspection JSUnusedGlobalSymbols (This file is loaded dynamically.)
/**
 * @returns {ArticleMetadata}
 */
export function getMetadata() {
    // noinspection SpellCheckingInspection (It's in Hungarian.)
    return {
        slug: 'fotozasblog-feheregyensuly-es-szinhomerseklet',
        title: 'Fehéregyensúly beállítás – viszlát, sárga fotók!',
        author: 'Illés Dániel',
        publishDate: new Date('2014-03-23'),
        publisherName: 'fotozasblog.hu',
        originalUrl: 'http://fotozasblog.hu/feher-egyensuly-beallitas-viszlat-sarga-fotok/',
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
        <FullWidthLocalImage fileName="fotozasblog-feheregyensuly-es-szinhomerseklet.png" altText="" />
    </>;
}