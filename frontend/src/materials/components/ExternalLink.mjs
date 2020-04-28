import React from '../../web_modules/react.js';

/**
 * @returns {React.ReactElement}
 * @private
 */
export default function ExternalLink({children, ...props}) {
    return <a className='external' target='_blank' rel='noopener' {...props}>{children}</a>;
}
