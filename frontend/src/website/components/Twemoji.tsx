/* Source/inspiration: https://github.com/ZxMYS/react-twemoji */

import React, {Children, cloneElement, createElement, createRef, useEffect, useRef, useState} from 'react';
import EmojiReplacer from '../EmojiReplacer';
import type {EmojiParseOptions} from '../EmojiReplacer';
const emojiReplacer = new EmojiReplacer({defaultAssetsBaseUrl: '/website/', defaultFileExtension: '.svg', defaultClassName: 'emoji', defaultSize: 'noto-emojis'});

interface TwemojiProps {
    children?: React.ReactNode;
    /** Default: "div" (via no-wrapper mode when omitted). */
    tag?: string;
    /** Options for the emoji replacer. */
    options?: EmojiParseOptions;
    /** Any other properties, applied to the wrapper element. */
    [key: string]: unknown;
}

export default function Twemoji({children, tag, options, ...other}: TwemojiProps) {
    const noWrapper = !tag;
    const rootRef = useRef<HTMLElement>(null);
    const [childRefs, setChildRefs] = useState<Record<number, React.RefObject<HTMLElement>>>({});

    useEffect(() => {
        if (noWrapper) {
            Object.values(childRefs).forEach(childRef => childRef.current && emojiReplacer.parse(childRef.current, options));
        } else if (rootRef.current) {
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
                        return cloneElement(child as React.ReactElement, {ref: childRefs[index]});
                    } else {
                        const newRef = createRef<HTMLElement>();
                        setChildRefs(childRefs => ({...childRefs, [index]: newRef}));
                        return cloneElement(child as React.ReactElement, {ref: newRef});
                    }
                })}
            </>;
    } else {
        return createElement(tag as string, {ref: rootRef, ...other}, children);
    }
}
