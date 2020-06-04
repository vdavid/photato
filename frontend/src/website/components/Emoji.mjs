import React from '../../web_modules/react.js';
import EmojiReplacer from '../EmojiReplacer.mjs';

const emojiReplacer = new EmojiReplacer();

export default function Emoji({alt}) {
    const unicode=emojiReplacer.convertToCodePoint(alt);
    return <img draggable="false" className="emoji" alt="{alt}" src={`/website/noto-emojis/${unicode.toLowerCase()}.svg`} />;
}