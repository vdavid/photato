import React from 'react';

interface YouTubeVideoProps extends React.IframeHTMLAttributes<HTMLIFrameElement> {
    /** Full YouTube embed URL, but without parameters! */
    src: string;
}

export default function YouTubeVideo({src, width = 560, height = 315, ...props}: YouTubeVideoProps) {
    // See https://developers.google.com/youtube/player_parameters?csw=1 for more options
    return <div className='youTubeVideoContainer'>
        <iframe width={width}
                height={height}
                src={src + '?cc_load_policy=1&cc_lang_pref=hu'}
                allow='accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; '
                allowFullScreen={true}
                {...props} />
    </div>;
}
