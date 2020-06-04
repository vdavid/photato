/* Source/inspiration: https://github.com/ZxMYS/react-twemoji */

import React, {Children, cloneElement, createElement, createRef, useEffect, useRef, useState} from '../../web_modules/react.js';
import EmojiReplacer from '../EmojiReplacer.mjs';
const emojiReplacer = new EmojiReplacer({defaultAssetsBaseUrl: '/website/', defaultFileExtension: '.svg', defaultClassName: 'emoji', defaultSize: 'noto-emojis'});

/**
 * @param {Component[]} children
 * @param {boolean} [noWrapper] Default: false
 * @param {string} [tag] Default: "div"
 * @param {Object} options Options for the emoji replacer
 * @param {*} other
 * @returns {Component}
 * @constructor
 */
export default function Twemoji({children, tag, options, ...other}) {
    const noWrapper = !tag;
    const rootRef = useRef();
    const [childRefs, setChildRefs] = useState({});

    useEffect(() => {
        if (noWrapper) {
            Object.values(childRefs).forEach(childRef => emojiReplacer.parse(childRef.current, options));
        } else {
            emojiReplacer.parse(rootRef.current, options);
        }
        return () => {
            setChildRefs({});
        };
    }, [childRefs, children, noWrapper, tag, options, other]);

    if (noWrapper) {
        return <>
                {Children.map(children, (child, index) => {
                    if (typeof child === 'string') {
                        return <>
                            {emojiReplacer.parse(child, options)}
                        </>
                    }
                    if (childRefs[index]) {
                        return cloneElement(child, {ref: childRefs[index]});
                    } else {
                        const newRef = createRef();
                        setChildRefs(childRefs => ({...childRefs, [index]: newRef}));
                        return cloneElement(child, {ref: newRef});
                    }
                })}
            </>;
    } else {
        return createElement(tag, {ref: rootRef, ...other}, children);
    }
}