import {createElement} from '../../web_modules/react.js';

/**
 * @returns {React.ReactElement}
 * @private
 */
export default function ExternalLink({children, ...props}) {
    return createElement('a', {className: 'external', target: '_blank', rel: 'noopener', ...props}, children);
}
