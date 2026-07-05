import React from 'react';
import EmojiReplacer from '../EmojiReplacer.jsx';

const emojiReplacer = new EmojiReplacer();

export default function Emoji({alt}) {
    const unicode=emojiReplacer.convertToCodePoint(alt);
    return <img draggable="false" className="emoji" alt="{alt}" src={`/website/noto-emojis/${unicode.toLowerCase()}.svg`} />;
}