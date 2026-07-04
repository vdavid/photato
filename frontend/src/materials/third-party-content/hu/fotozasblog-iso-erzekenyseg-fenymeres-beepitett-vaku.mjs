import React from '../../../web_modules/react.js';
import FullWidthLocalImage from '../../../challenges/components/FullWidthLocalImage.mjs';

// noinspection JSUnusedGlobalSymbols (This file is loaded dynamically.)
/**
 * @returns {ArticleMetadata}
 */
export function getMetadata() {
    // noinspection SpellCheckingInspection (It's in Hungarian.)
    return {
        slug: 'fotozasblog-iso-erzekenyseg-fenymeres-beepitett-vaku',
        title: 'Fotózás alapok',
        author: 'Illés Dániel',
        publishDate: new Date('2014-02-09'),
        publisherName: 'fotozasblog.hu',
        originalUrl: 'http://fotozasblog.hu/fotozas-alapjai-iso-fenymeres/',
        isOriginalUrlBroken: true,
    };
}

// noinspection JSUnusedGlobalSymbols (This file is loaded dynamically.)
/**
 * @returns {React.ReactElement}
 */
export default function Article() {
    // noinspection SpellCheckingInspection (It's in Hungarian.)
    return <>
        <FullWidthLocalImage fileName="fotozasblog-iso-erzekenyseg-fenymeres-beepitett-vaku.png" altText="" />
    </>;
}