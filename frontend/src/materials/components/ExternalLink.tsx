import React from 'react';

export default function ExternalLink({children, className, ...props}: React.AnchorHTMLAttributes<HTMLAnchorElement>) {
    const modifiedClassName = className ? [...className.split(/\s+/), 'external'].join(' ') : 'external';
    return <a className={modifiedClassName} target='_blank' rel='noopener' {...props}>{children}</a>;
}
