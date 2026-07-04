import React, {useEffect, useState} from '../../web_modules/react.js';
import {useI18n} from '../../i18n/components/I18nProvider.mjs';

export default function FullPageLoadingIndicator() {
    const {__, areTranslationsLoaded} = useI18n();
    const [isTakingLong, setTakingLong] = useState(false);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setTakingLong(true);
        }, 4000);

        return () => {
            clearTimeout(timeout);
        }
    });

    return <div id='fullPageLoadingIndicator'>
        <div>
            <div className='spinner'/>
            <div className='logo'>
                <img src='/website/aperture-logo.svg' alt="logo" className="logo" />
                <img src="/website/photato-logo-text.svg" alt="Photato" className="siteTitle" />
            </div>
        </div>
        {isTakingLong && areTranslationsLoaded ? <div className="loadingTakingLong">{__('Loading seems to take longer than usual. If you think this is a problem, please report it here.')}</div> : null}
    </div>;
}