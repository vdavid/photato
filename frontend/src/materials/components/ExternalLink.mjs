import React from '../../web_modules/react.js';

/**
 * @returns {React.ReactElement}
 * @private
 */
export default function ExternalLink({children, className, ...props}) {
    const modifiedClassName = className ? [...className.split(/\s+/), 'external'].join(' ') : 'external';
    return <a className={modifiedClassName} target='_blank' rel='noopener' {...props}>{children}</a>;
}
