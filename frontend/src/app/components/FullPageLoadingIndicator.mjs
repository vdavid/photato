import React from '../../web_modules/react.js';

export default function FullPageLoadingIndicator() {
    return <div id='fullPageLoadingIndicator'>
        <div>
            <div className='spinner'/>
            <div className='logo'/>
        </div>
    </div>;
}