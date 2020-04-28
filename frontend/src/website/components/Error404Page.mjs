import React from '../../web_modules/react.js';
import {useI18n} from '../../i18n/components/I18nProvider.mjs';
import {NavLink} from '../../web_modules/react-router-dom.js';

export default function Error404Page() {
    const {__} = useI18n();

    return <>
        <h1>{__('404 error')}</h1>
        <p>{__('This page does not exist')}</p>
        <NavLink to='/'>{__('Return to the Photato main page.')}</NavLink>
    </>;
}
