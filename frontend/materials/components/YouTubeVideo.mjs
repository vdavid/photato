import {createElement} from '../../web_modules/react.js';

/**
 * @param {string} src Full YouTube embed URL, but without parameters!
 * @param {int} [width] Default is 560.
 * @param {int} [height] Default is 315.
 * @param {Object} [props] Any other properties, they'll be applied to the iframe element
 * @returns {React.ReactElement}
 * @private
 */
export default function YouTubeVideo({src, width = 560, height = 315, ...props}) {
    // See https://developers.google.com/youtube/player_parameters?csw=1 for more options
    return createElement('div', {className: 'youTubeVideoContainer'},
        createElement('iframe', {width, height, src: src + '?cc_load_policy=1&cc_lang_pref=hu', allow: 'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; ', allowFullScreen: true, ...props}),
    );
}
