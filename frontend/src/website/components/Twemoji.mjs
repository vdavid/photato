/* Source/inspiration: https://github.com/ZxMYS/react-twemoji */

import React, {Children, cloneElement, createElement, createRef, useEffect, useRef, useState} from '../../web_modules/react.js';
import EmojiReplacer from '../EmojiReplacer.mjs';

const emojiReplacer = new EmojiReplacer();

let childrenRefs = {};
/**
 * @param {Component[]} children
 * @param {boolean} [noWrapper] Default: false
 * @param {string} [tag] Default: "div"
 * @param {Object} options Options for the emoji replacer
 * @param {*} other
 * @returns {Component}
 * @constructor
 */
export default function Twemoji({children, noWrapper, tag = 'div', options, ...other}) {
    const rootRefRef = useRef(createRef());

    useEffect(() => {
        if (noWrapper) { // TODO: The "noWrapper" feature doesn't work!
            for (const childRef of Object.values(childrenRefs)) {
                emojiReplacer.parse(childRef.current, options);
            }
        } else {
            emojiReplacer.parse(rootRefRef.current.current, options);
        }
    }, [children, noWrapper, tag, options, other]);

    if (noWrapper) {
        return <>
                {Children.map(children, (child, index) => {
                    return cloneElement(child, {ref: childrenRefs.current[index]});
                })}
            </>;
    } else {
        return createElement(tag, {ref: rootRefRef.current, ...other}, children);
    }
}