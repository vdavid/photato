/* Source/inspiration: Twemoji: https://github.com/twitter/twemoji */

export default class EmojiReplacer {
    /**
     * @param {string} defaultAssetsBaseUrl If not specified, Twitter's URL will be used.
     * @param {string} defaultFileExtension If not specified, ".png" will be used.
     * @param {string} defaultSize If not specified, "72x72" will be used.
     * @param {string} defaultClassName If not specified, "emoji" will be used.
     */
    constructor({defaultAssetsBaseUrl, defaultFileExtension, defaultSize, defaultClassName} = {}) {
        this._defaultAssetsBaseUrl = defaultAssetsBaseUrl || 'https://twemoji.maxcdn.com/v/13.0.0/';
        this._defaultFileExtension = defaultFileExtension || '.png';
        this._defaultSize = defaultSize || '72x72';
        this._defaultClassName = defaultClassName || 'emoji';

        // RegExp based on emoji's official Unicode standards
        // http://www.unicode.org/Public/UNIDATA/EmojiSources.txt
        this._emojiRegExp = /(?:\ud83d\udc68\ud83c\udffb\u200d\ud83e\udd1d\u200d\ud83d\udc68\ud83c[\udffc-\udfff]|\ud83d\udc68\ud83c\udffc\u200d\ud83e\udd1d\u200d\ud83d\udc68\ud83c[\udffb\udffd-\udfff]|\ud83d\udc68\ud83c\udffd\u200d\ud83e\udd1d\u200d\ud83d\udc68\ud83c[\udffb\udffc\udffe\udfff]|\ud83d\udc68\ud83c\udffe\u200d\ud83e\udd1d\u200d\ud83d\udc68\ud83c[\udffb-\udffd\udfff]|\ud83d\udc68\ud83c\udfff\u200d\ud83e\udd1d\u200d\ud83d\udc68\ud83c[\udffb-\udffe]|\ud83d\udc69\ud83c\udffb\u200d\ud83e\udd1d\u200d\ud83d\udc68\ud83c[\udffc-\udfff]|\ud83d\udc69\ud83c\udffb\u200d\ud83e\udd1d\u200d\ud83d\udc69\ud83c[\udffc-\udfff]|\ud83d\udc69\ud83c\udffc\u200d\ud83e\udd1d\u200d\ud83d\udc68\ud83c[\udffb\udffd-\udfff]|\ud83d\udc69\ud83c\udffc\u200d\ud83e\udd1d\u200d\ud83d\udc69\ud83c[\udffb\udffd-\udfff]|\ud83d\udc69\ud83c\udffd\u200d\ud83e\udd1d\u200d\ud83d\udc68\ud83c[\udffb\udffc\udffe\udfff]|\ud83d\udc69\ud83c\udffd\u200d\ud83e\udd1d\u200d\ud83d\udc69\ud83c[\udffb\udffc\udffe\udfff]|\ud83d\udc69\ud83c\udffe\u200d\ud83e\udd1d\u200d\ud83d\udc68\ud83c[\udffb-\udffd\udfff]|\ud83d\udc69\ud83c\udffe\u200d\ud83e\udd1d\u200d\ud83d\udc69\ud83c[\udffb-\udffd\udfff]|\ud83d\udc69\ud83c\udfff\u200d\ud83e\udd1d\u200d\ud83d\udc68\ud83c[\udffb-\udffe]|\ud83d\udc69\ud83c\udfff\u200d\ud83e\udd1d\u200d\ud83d\udc69\ud83c[\udffb-\udffe]|\ud83e\uddd1\ud83c\udffb\u200d\ud83e\udd1d\u200d\ud83e\uddd1\ud83c[\udffb-\udfff]|\ud83e\uddd1\ud83c\udffc\u200d\ud83e\udd1d\u200d\ud83e\uddd1\ud83c[\udffb-\udfff]|\ud83e\uddd1\ud83c\udffd\u200d\ud83e\udd1d\u200d\ud83e\uddd1\ud83c[\udffb-\udfff]|\ud83e\uddd1\ud83c\udffe\u200d\ud83e\udd1d\u200d\ud83e\uddd1\ud83c[\udffb-\udfff]|\ud83e\uddd1\ud83c\udfff\u200d\ud83e\udd1d\u200d\ud83e\uddd1\ud83c[\udffb-\udfff]|\ud83e\uddd1\u200d\ud83e\udd1d\u200d\ud83e\uddd1|\ud83d\udc6b\ud83c[\udffb-\udfff]|\ud83d\udc6c\ud83c[\udffb-\udfff]|\ud83d\udc6d\ud83c[\udffb-\udfff]|\ud83d[\udc6b-\udc6d])|(?:\ud83d[\udc68\udc69]|\ud83e\uddd1)(?:\ud83c[\udffb-\udfff])?\u200d(?:\u2695\ufe0f|\u2696\ufe0f|\u2708\ufe0f|\ud83c[\udf3e\udf73\udf7c\udf84\udf93\udfa4\udfa8\udfeb\udfed]|\ud83d[\udcbb\udcbc\udd27\udd2c\ude80\ude92]|\ud83e[\uddaf-\uddb3\uddbc\uddbd])|(?:\ud83c[\udfcb\udfcc]|\ud83d[\udd74\udd75]|\u26f9)((?:\ud83c[\udffb-\udfff]|\ufe0f)\u200d[\u2640\u2642]\ufe0f)|(?:\ud83c[\udfc3\udfc4\udfca]|\ud83d[\udc6e\udc70\udc71\udc73\udc77\udc81\udc82\udc86\udc87\ude45-\ude47\ude4b\ude4d\ude4e\udea3\udeb4-\udeb6]|\ud83e[\udd26\udd35\udd37-\udd39\udd3d\udd3e\uddb8\uddb9\uddcd-\uddcf\uddd6-\udddd])(?:\ud83c[\udffb-\udfff])?\u200d[\u2640\u2642]\ufe0f|(?:\ud83d\udc68\u200d\u2764\ufe0f\u200d\ud83d\udc8b\u200d\ud83d\udc68|\ud83d\udc68\u200d\ud83d\udc68\u200d\ud83d\udc66\u200d\ud83d\udc66|\ud83d\udc68\u200d\ud83d\udc68\u200d\ud83d\udc67\u200d\ud83d[\udc66\udc67]|\ud83d\udc68\u200d\ud83d\udc69\u200d\ud83d\udc66\u200d\ud83d\udc66|\ud83d\udc68\u200d\ud83d\udc69\u200d\ud83d\udc67\u200d\ud83d[\udc66\udc67]|\ud83d\udc69\u200d\u2764\ufe0f\u200d\ud83d\udc8b\u200d\ud83d[\udc68\udc69]|\ud83d\udc69\u200d\ud83d\udc69\u200d\ud83d\udc66\u200d\ud83d\udc66|\ud83d\udc69\u200d\ud83d\udc69\u200d\ud83d\udc67\u200d\ud83d[\udc66\udc67]|\ud83d\udc68\u200d\u2764\ufe0f\u200d\ud83d\udc68|\ud83d\udc68\u200d\ud83d\udc66\u200d\ud83d\udc66|\ud83d\udc68\u200d\ud83d\udc67\u200d\ud83d[\udc66\udc67]|\ud83d\udc68\u200d\ud83d\udc68\u200d\ud83d[\udc66\udc67]|\ud83d\udc68\u200d\ud83d\udc69\u200d\ud83d[\udc66\udc67]|\ud83d\udc69\u200d\u2764\ufe0f\u200d\ud83d[\udc68\udc69]|\ud83d\udc69\u200d\ud83d\udc66\u200d\ud83d\udc66|\ud83d\udc69\u200d\ud83d\udc67\u200d\ud83d[\udc66\udc67]|\ud83d\udc69\u200d\ud83d\udc69\u200d\ud83d[\udc66\udc67]|\ud83c\udff3\ufe0f\u200d\u26a7\ufe0f|\ud83c\udff3\ufe0f\u200d\ud83c\udf08|\ud83c\udff4\u200d\u2620\ufe0f|\ud83d\udc15\u200d\ud83e\uddba|\ud83d\udc3b\u200d\u2744\ufe0f|\ud83d\udc41\u200d\ud83d\udde8|\ud83d\udc68\u200d\ud83d[\udc66\udc67]|\ud83d\udc69\u200d\ud83d[\udc66\udc67]|\ud83d\udc6f\u200d\u2640\ufe0f|\ud83d\udc6f\u200d\u2642\ufe0f|\ud83e\udd3c\u200d\u2640\ufe0f|\ud83e\udd3c\u200d\u2642\ufe0f|\ud83e\uddde\u200d\u2640\ufe0f|\ud83e\uddde\u200d\u2642\ufe0f|\ud83e\udddf\u200d\u2640\ufe0f|\ud83e\udddf\u200d\u2642\ufe0f|\ud83d\udc08\u200d\u2b1b)|[#*0-9]\ufe0f?\u20e3|(?:[©®\u2122\u265f]\ufe0f)|(?:\ud83c[\udc04\udd70\udd71\udd7e\udd7f\ude02\ude1a\ude2f\ude37\udf21\udf24-\udf2c\udf36\udf7d\udf96\udf97\udf99-\udf9b\udf9e\udf9f\udfcd\udfce\udfd4-\udfdf\udff3\udff5\udff7]|\ud83d[\udc3f\udc41\udcfd\udd49\udd4a\udd6f\udd70\udd73\udd76-\udd79\udd87\udd8a-\udd8d\udda5\udda8\uddb1\uddb2\uddbc\uddc2-\uddc4\uddd1-\uddd3\udddc-\uddde\udde1\udde3\udde8\uddef\uddf3\uddfa\udecb\udecd-\udecf\udee0-\udee5\udee9\udef0\udef3]|[\u203c\u2049\u2139\u2194-\u2199\u21a9\u21aa\u231a\u231b\u2328\u23cf\u23ed-\u23ef\u23f1\u23f2\u23f8-\u23fa\u24c2\u25aa\u25ab\u25b6\u25c0\u25fb-\u25fe\u2600-\u2604\u260e\u2611\u2614\u2615\u2618\u2620\u2622\u2623\u2626\u262a\u262e\u262f\u2638-\u263a\u2640\u2642\u2648-\u2653\u2660\u2663\u2665\u2666\u2668\u267b\u267f\u2692-\u2697\u2699\u269b\u269c\u26a0\u26a1\u26a7\u26aa\u26ab\u26b0\u26b1\u26bd\u26be\u26c4\u26c5\u26c8\u26cf\u26d1\u26d3\u26d4\u26e9\u26ea\u26f0-\u26f5\u26f8\u26fa\u26fd\u2702\u2708\u2709\u270f\u2712\u2714\u2716\u271d\u2721\u2733\u2734\u2744\u2747\u2757\u2763\u2764\u27a1\u2934\u2935\u2b05-\u2b07\u2b1b\u2b1c\u2b50\u2b55\u3030\u303d\u3297\u3299])(?:\ufe0f|(?!\ufe0e))|(?:(?:\ud83c[\udfcb\udfcc]|\ud83d[\udd74\udd75\udd90]|[\u261d\u26f7\u26f9\u270c\u270d])(?:\ufe0f|(?!\ufe0e))|(?:\ud83c[\udf85\udfc2-\udfc4\udfc7\udfca]|\ud83d[\udc42\udc43\udc46-\udc50\udc66-\udc69\udc6e\udc70-\udc78\udc7c\udc81-\udc83\udc85-\udc87\udcaa\udd7a\udd95\udd96\ude45-\ude47\ude4b-\ude4f\udea3\udeb4-\udeb6\udec0\udecc]|\ud83e[\udd0c\udd0f\udd18-\udd1c\udd1e\udd1f\udd26\udd30-\udd39\udd3d\udd3e\udd77\uddb5\uddb6\uddb8\uddb9\uddbb\uddcd-\uddcf\uddd1-\udddd]|[\u270a\u270b]))(?:\ud83c[\udffb-\udfff])?|(?:\ud83c\udff4\udb40\udc67\udb40\udc62\udb40\udc65\udb40\udc6e\udb40\udc67\udb40\udc7f|\ud83c\udff4\udb40\udc67\udb40\udc62\udb40\udc73\udb40\udc63\udb40\udc74\udb40\udc7f|\ud83c\udff4\udb40\udc67\udb40\udc62\udb40\udc77\udb40\udc6c\udb40\udc73\udb40\udc7f|\ud83c\udde6\ud83c[\udde8-\uddec\uddee\uddf1\uddf2\uddf4\uddf6-\uddfa\uddfc\uddfd\uddff]|\ud83c\udde7\ud83c[\udde6\udde7\udde9-\uddef\uddf1-\uddf4\uddf6-\uddf9\uddfb\uddfc\uddfe\uddff]|\ud83c\udde8\ud83c[\udde6\udde8\udde9\uddeb-\uddee\uddf0-\uddf5\uddf7\uddfa-\uddff]|\ud83c\udde9\ud83c[\uddea\uddec\uddef\uddf0\uddf2\uddf4\uddff]|\ud83c\uddea\ud83c[\udde6\udde8\uddea\uddec\udded\uddf7-\uddfa]|\ud83c\uddeb\ud83c[\uddee-\uddf0\uddf2\uddf4\uddf7]|\ud83c\uddec\ud83c[\udde6\udde7\udde9-\uddee\uddf1-\uddf3\uddf5-\uddfa\uddfc\uddfe]|\ud83c\udded\ud83c[\uddf0\uddf2\uddf3\uddf7\uddf9\uddfa]|\ud83c\uddee\ud83c[\udde8-\uddea\uddf1-\uddf4\uddf6-\uddf9]|\ud83c\uddef\ud83c[\uddea\uddf2\uddf4\uddf5]|\ud83c\uddf0\ud83c[\uddea\uddec-\uddee\uddf2\uddf3\uddf5\uddf7\uddfc\uddfe\uddff]|\ud83c\uddf1\ud83c[\udde6-\udde8\uddee\uddf0\uddf7-\uddfb\uddfe]|\ud83c\uddf2\ud83c[\udde6\udde8-\udded\uddf0-\uddff]|\ud83c\uddf3\ud83c[\udde6\udde8\uddea-\uddec\uddee\uddf1\uddf4\uddf5\uddf7\uddfa\uddff]|\ud83c\uddf4\ud83c\uddf2|\ud83c\uddf5\ud83c[\udde6\uddea-\udded\uddf0-\uddf3\uddf7-\uddf9\uddfc\uddfe]|\ud83c\uddf6\ud83c\udde6|\ud83c\uddf7\ud83c[\uddea\uddf4\uddf8\uddfa\uddfc]|\ud83c\uddf8\ud83c[\udde6-\uddea\uddec-\uddf4\uddf7-\uddf9\uddfb\uddfd-\uddff]|\ud83c\uddf9\ud83c[\udde6\udde8\udde9\uddeb-\udded\uddef-\uddf4\uddf7\uddf9\uddfb\uddfc\uddff]|\ud83c\uddfa\ud83c[\udde6\uddec\uddf2\uddf3\uddf8\uddfe\uddff]|\ud83c\uddfb\ud83c[\udde6\udde8\uddea\uddec\uddee\uddf3\uddfa]|\ud83c\uddfc\ud83c[\uddeb\uddf8]|\ud83c\uddfd\ud83c\uddf0|\ud83c\uddfe\ud83c[\uddea\uddf9]|\ud83c\uddff\ud83c[\udde6\uddf2\uddfc]|\ud83c[\udccf\udd8e\udd91-\udd9a\udde6-\uddff\ude01\ude32-\ude36\ude38-\ude3a\ude50\ude51\udf00-\udf20\udf2d-\udf35\udf37-\udf7c\udf7e-\udf84\udf86-\udf93\udfa0-\udfc1\udfc5\udfc6\udfc8\udfc9\udfcf-\udfd3\udfe0-\udff0\udff4\udff8-\udfff]|\ud83d[\udc00-\udc3e\udc40\udc44\udc45\udc51-\udc65\udc6a\udc6f\udc79-\udc7b\udc7d-\udc80\udc84\udc88-\udca9\udcab-\udcfc\udcff-\udd3d\udd4b-\udd4e\udd50-\udd67\udda4\uddfb-\ude44\ude48-\ude4a\ude80-\udea2\udea4-\udeb3\udeb7-\udebf\udec1-\udec5\uded0-\uded2\uded5-\uded7\udeeb\udeec\udef4-\udefc\udfe0-\udfeb]|\ud83e[\udd0d\udd0e\udd10-\udd17\udd1d\udd20-\udd25\udd27-\udd2f\udd3a\udd3c\udd3f-\udd45\udd47-\udd76\udd78\udd7a-\uddb4\uddb7\uddba\uddbc-\uddcb\uddd0\uddde-\uddff\ude70-\ude74\ude78-\ude7a\ude80-\ude86\ude90-\udea8\udeb0-\udeb6\udec0-\udec2\uded0-\uded6]|[\u23e9-\u23ec\u23f0\u23f3\u267e\u26ce\u2705\u2728\u274c\u274e\u2753-\u2755\u2795-\u2797\u27b0\u27bf\ue50a])|\ufe0f/g;
    }

    /**
     * Given an HEX code point, returns UTF16 surrogate pairs.
     *
     * @param {string} codePoint Generic code point, i.e. '1F4A9'
     * @return {string} Code point transformed into utf16 surrogates pair, i.e. \uD83D\uDCA9
     *
     * @example
     *  twemoji.convert.fromCodePoint('1f1e8');
     *  // "\ud83c\udde8"
     *
     *  '1f1e8-1f1f3'.split('-').map(twemoji.convert.fromCodePoint).join('')
     *  // "\ud83c\udde8\ud83c\uddf3"
     */
    convertFromCodePoint(codePoint) {
        let code = typeof codePoint === 'string' ? parseInt(codePoint, 16) : codePoint;
        if (code < 0x10000) {
            return String.fromCharCode(code);
        } else {
            code -= 0x10000;
            return String.fromCharCode(0xD800 + (code >> 10), 0xDC00 + (code & 0x3FF));
        }
    }

    /**
     * Given UTF16 surrogate pairs, returns the equivalent HEX code point.
     *
     * @param {string} unicodeSurrogates Generic utf16 surrogates pair, i.e. \uD83D\uDCA9
     * @param {string} [separator] Optional separator for double code points, default: '-'
     * @return {string} utf16 transformed into code point, i.e. '1F4A9'
     *
     * @example
     *  twemoji.convert.toCodePoint('\ud83c\udde8\ud83c\uddf3');
     *  // "1f1e8-1f1f3"
     *
     *  twemoji.convert.toCodePoint('\ud83c\udde8\ud83c\uddf3', '~');
     *  // "1f1e8~1f1f3"
     */
    convertToCodePoint(unicodeSurrogates, separator = '-') {
        const returnValue = [];
        let characterCode = 0;
        let previousCharacterCode = 0;
        let index = 0;
        while (index < unicodeSurrogates.length) {
            characterCode = unicodeSurrogates.charCodeAt(index++);
            if (previousCharacterCode) {
                returnValue.push((0x10000 + ((previousCharacterCode - 0xD800) << 10) + (characterCode - 0xDC00)).toString(16));
                previousCharacterCode = 0;
            } else if (0xD800 <= characterCode && characterCode <= 0xDBFF) {
                previousCharacterCode = characterCode;
            } else {
                returnValue.push(characterCode.toString(16));
            }
        }
        return returnValue.join(separator);
    }

    /**
     * Main method/logic to generate either <img> tags or HTMLImage nodes.
     *  "emojify" a generic text or DOM Element.
     *
     * @overloads
     *
     * String replacement for `innerHTML` or server side operations
     *  twemoji.parse(string);
     *  twemoji.parse(string, Function);
     *  twemoji.parse(string, Object);
     *
     * HTMLElement tree parsing for safer operations over existing DOM
     *  twemoji.parse(HTMLElement);
     *  twemoji.parse(HTMLElement, Function);
     *  twemoji.parse(HTMLElement, Object);
     *
     * @param {string|HTMLElement} what The source to parse and enrich with emoji.
     *     1. If string: Replace emoji matches with <img> tags. Mainly used to inject emoji via `innerHTML`.
     *        It does **not** parse the string or validate it, it simply replaces found emoji with a tag.
     *        NOTE: be sure this won't affect security.
     *     2. If HTMLElement: Walk through the DOM tree and find emoji that are inside **text node only** (nodeType === 3)
     *        Mainly used to put emoji in already generated DOM without compromising surrounding nodes and
     *        **avoiding** the usage of `innerHTML`.
     *        NOTE: Using DOM elements instead of strings should improve security without compromising too much
     *              performance compared with a less safe `innerHTML`.
     * @param {function(iconId: string, options: {callback: function, attributes: string, base: string, ext: string, size: string, className: string, onerror: function}, variant: char): string|boolean} [callback]
     *        This will be invoked per each emoji that has been found through the RegExp except those followed by the invariant \uFE0E ("as text").
     *            iconId: The lower case HEX code point, i.e. "1f4a9"
     *            options: All info for this parsing operation
     *            variant: The optional \uFE0F ("as image") variant, in case this info is anyhow meaningful. By default this is ignored.
     *        If returns a falsy value instead of a valid `src` to use for the image, nothing will actually change for that specific emoji.
     * @param {function} [attributes] A function returning attributes
     * @param {string} [base] The base url, by default 'https://twemoji.maxcdn.com/v/13.0.0/'.
     * @param {string} [ext] The image extension, by default '.png'.
     * @param {string} [folder]
     * @param {string} [size] The assets size, by default '72x72'.
     * @param {string} [className]
     * @param {function} [onerror]
     * @example
     *  twemoji.parse("I \u2764\uFE0F emoji!");
     *  // I <img class="emoji" draggable="false" alt="❤️" src="/assets/2764.gif"/> emoji!
     *
     *  twemoji.parse("I \u2764\uFE0F emoji!", function(iconId, options) {
     *    return '/assets/' + iconId + '.gif';
     *  });
     *  // I <img class="emoji" draggable="false" alt="❤️" src="/assets/2764.gif"/> emoji!
     *
     * twemoji.parse("I \u2764\uFE0F emoji!", {
     *   size: 72,
     *   callback: function(iconId, options) {
     *     return '/assets/' + options.size + '/' + iconId + options.ext;
     *   }
     * });
     *  // I <img class="emoji" draggable="false" alt="❤️" src="/assets/72x72/2764.png"/> emoji!
     *
     */
    parse(what, {callback, attributes, base, ext, folder, size, className, onerror} = {}) {
        const createTextFunction = this._createText;
        /**
         * User first: used to remove missing images preserving the original text intent when a fallback for network
         * problems is desired. Automatically added to Image nodes via DOM. It could be recycled for string operations via:
         *  $('img.emoji').on('error', twemoji.onerror)
         */
        function defaultErrorHandler() {
            if (this.parentNode) {
                this.parentNode.replaceChild(createTextFunction(this.alt, false), this);
            }
        }

        /**
         * Given a generic value, creates its squared counterpart if it's a number.
         *  As example, number 36 will return '36x36'.
         * @param {any} value A generic value.
         * @return {any} A string representing asset size, i.e. "36x36"
         *                  only in case the value was a number.
         *                  Returns initial value otherwise.
         */
        function toSizeSquaredAsset(value) {
            return typeof value === 'number' ? value + 'x' + value : value;
        }

        const how = {
            callback: callback || this._defaultImageSrcGenerator,
            attributes: attributes || (() => null),
            base: base || this._defaultAssetsBaseUrl,
            ext: ext || this._defaultFileExtension,
            size: folder || toSizeSquaredAsset(size || this._defaultSize),
            className: className || this._defaultClassName,
            onerror: onerror || defaultErrorHandler
        };

        // if first argument is string, inject html <img> tags
        // otherwise use the DOM tree and parse text nodes only
        if (typeof what === 'string') {
            return this._parseString(what, how);
        } else {
            return this._parseNode(what, how);
        }
    }

    /**
     * Given a string, invokes the callback argument per each emoji found in such string.
     * This is the most raw version used by the .parse(string) method itself.
     *
     * @param {string} text Generic string to parse
     * @param {Function} callback A generic callback that will be invoked to replace the content.
     *        This callback will receive standard `String.prototype.replace(str, callback)` arguments such:
     *  callback(
     *    rawText,  // the emoji match
     *  );
     *        and others commonly received via replace.
     */
    replace(text, callback) {
        return String(text).replace(this._emojiRegExp, callback);
    }

    /**
     * Simplify string tests against emoji.
     *
     * @param {string} text Some text that might contain emoji
     * @return {boolean} True if any emoji was found, false otherwise.
     *
     * @example
     *  if (twemoji.test(someContent)) {
     *    console.log("emoji All The Things!");
     *  }
     */
    test(text) {
        // IE6 needs a reset before too
        this._emojiRegExp.lastIndex = 0;
        const result = this._emojiRegExp.test(text);
        this._emojiRegExp.lastIndex = 0;
        return result;
    }

    /**
     * Shortcut to create text nodes
     * @param {string} text Text used to create DOM text node
     * @param {boolean} clean
     * @return {Node}  a DOM node with that text
     */
    _createText(text, clean) {

        // avoid runtime RegExp creation for not so smart,
        // not JIT based, and old browsers / engines
        const UFE0Fg = /\uFE0F/g;

        return document.createTextNode(clean ? text.replace(UFE0Fg, '') : text);
    }

    /**
     * Utility function to escape html attribute text
     * @param {string} string Text use in HTML attribute
     * @return {string} Text encoded to use in HTML attribute
     */

    _escapeHTML(string) {
        // used to find HTML special chars in attributes
        const rescaper = /[&<>'"]/g;

        // used to escape HTML special chars in attributes
        const escaper = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            "'": '&#39;',
            '"': '&quot;'
        };
        return string.replace(rescaper, m => escaper[m]);
    }

    /**
     * Default callback used to generate emoji src
     *  based on Twitter CDN
     * @param {string} icon The emoji code point string
     * @param {{base: string, size: string, ext: string}} options The default size to use, i.e. "36x36"
     * @return {string} The image source to use
     */
    _defaultImageSrcGenerator(icon, options) {
        return ''.concat(options.base, options.size, '/', icon, options.ext);
    }

    /**
     * Given a generic DOM nodeType 1, walk through all children
     * and store every nodeType 3 (#text) found in the tree.
     * @param {Element} node A DOM Element with probably some text in it
     * @param {Array} allText The list of previously discovered text nodes
     * @return {Array} Same list with new discovered nodes, if any
     */
    _grabAllTextNodes(node, allText) {
        // nodes with type 1 which should **not** be parsed
        const shouldNotBeParsed = /^(?:iframe|noframes|noscript|script|select|style|textarea)$/;

        const childNodes = node.childNodes;
        let length = childNodes ? childNodes.length : 0;
        let subNode;
        let nodeType;
        while (length--) {
            subNode = childNodes[length];
            nodeType = subNode.nodeType;
            // parse emoji only in text nodes
            if (nodeType === 3) {
                // collect them to process emoji later
                allText.push(subNode);
            }
                // ignore all nodes that are not type 1, that are svg, or that
            // should not be parsed as script, style, and others
            else if (nodeType === 1 && !('ownerSVGElement' in subNode) &&
                !shouldNotBeParsed.test(subNode.nodeName.toLowerCase())) {
                this._grabAllTextNodes(subNode, allText);
            }
        }
        return allText;
    }

    /**
     * Used to both remove the possible variant
     *  and to convert utf16 into code points.
     *  If there is a zero-width-joiner (U+200D), leave the variants in.
     * @param {string} rawText The raw text of the emoji match
     * @return {string} The code point
     */
    _grabTheRightIcon(rawText) {
        // avoid using a string literal like '\u200D' here because minifiers expand it inline
        const U200D = String.fromCharCode(0x200D);

        // avoid runtime RegExp creation for not so smart,
        // not JIT based, and old browsers / engines
        const UFE0Fg = /\uFE0F/g;

        // if variant is present as \uFE0F
        return this.convertToCodePoint(rawText.indexOf(U200D) < 0 ? rawText.replace(UFE0Fg, '') : rawText);
    }

    /**
     * DOM version of the same logic / parser:
     *  emojify all found sub-text nodes placing images node instead.
     * @param {Element} node Generic DOM node with some text in some child node
     * @param {Object} options Options containing info about how to parse
     *
     *            .callback   Function  the callback to invoke per each found emoji.
     *            .base       string    the base url, by default twemoji.base
     *            .ext        string    the image extension, by default twemoji.ext
     *            .size       string    the assets size, by default twemoji.size
     *
     * @return {Element} Same generic node with emoji in place, if any.
     */
    _parseNode(node, options) {
        const allText = this._grabAllTextNodes(node, []);
        let length = allText.length;
        let attrib;
        let attributeName;
        let modified;
        let fragment;
        let subNode;
        let text;
        let match;
        let i;
        let index;
        let img;
        let rawText;
        let iconId;
        let src;

        while (length--) {
            modified = false;
            fragment = document.createDocumentFragment();
            subNode = allText[length];
            text = subNode.nodeValue;
            i = 0;
            while ((match = this._emojiRegExp.exec(text))) {
                index = match.index;
                if (index !== i) {
                    fragment.appendChild(this._createText(text.slice(i, index), true));
                }
                rawText = match[0];
                iconId = this._grabTheRightIcon(rawText);
                i = index + rawText.length;
                src = options.callback(iconId, options);
                if (iconId && src) {
                    img = new Image();
                    img.onerror = options.onerror;
                    img.setAttribute('draggable', 'false');
                    attrib = options.attributes(rawText, iconId);
                    for (attributeName in attrib) {
                        if (
                            attrib.hasOwnProperty(attributeName) &&
                            // don't allow any handlers to be set + don't allow overrides
                            attributeName.indexOf('on') !== 0 &&
                            !img.hasAttribute(attributeName)
                        ) {
                            img.setAttribute(attributeName, attrib[attributeName]);
                        }
                    }
                    img.className = options.className;
                    img.alt = rawText;
                    img.src = src;
                    modified = true;
                    fragment.appendChild(img);
                }
                if (!img) {
                    fragment.appendChild(this._createText(rawText, false));
                }
                img = null;
            }
            // is there actually anything to replace in here ?
            if (modified) {
                // any text left to be added ?
                if (i < text.length) {
                    fragment.appendChild(
                        this._createText(text.slice(i), true)
                    );
                }
                // replace the text node only, leave intact
                // anything else surrounding such text
                subNode.parentNode.replaceChild(fragment, subNode);
            }
        }
        return node;
    }

    /**
     * String/HTML version of the same logic / parser:
     *  emojify a generic text placing images tags instead of surrogates pair.
     * @param {string} string Generic string with possibly some emoji in it
     * @param {Object} options Options containing info about how to parse
     *            .callback   Function  the callback to invoke per each found emoji.
     *            .base       string    the base url, by default twemoji.base
     *            .ext        string    the image extension, by default twemoji.ext
     *            .size       string    the assets size, by default twemoji.size
     *
     * @return {string} The string with <img tags> replacing all found and parsed emoji
     */
    _parseString(string, options) {
        return this.replace(string, function (rawText) {
            let returnValue = rawText;
            const iconId = this._grabTheRightIcon(rawText);
            const src = options.callback(iconId, options);
            let attributes;
            let attributeName;
            if (iconId && src) {
                // recycle the match string replacing the emoji with its image counter part
                returnValue = `<img class="${options.className}" draggable="false" alt="${rawText}" src="${src}"`;
                attributes = options.attributes(rawText, iconId);
                for (attributeName in attributes) {
                    if (attributes.hasOwnProperty(attributeName) &&
                        // don't allow any handlers to be set + don't allow overrides
                        attributeName.indexOf('on') !== 0 &&
                        returnValue.indexOf(' ' + attributeName + '=') === -1
                    ) {
                        returnValue = returnValue.concat(' ', attributeName, '="', this._escapeHTML(attributes[attributeName]), '"');
                    }
                }
                returnValue = returnValue.concat('/>');
            }
            return returnValue;
        });
    }
}