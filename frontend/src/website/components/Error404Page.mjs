import React, {useEffect} from '../../web_modules/react.js';
import {useI18n} from '../../i18n/components/I18nProvider.mjs';
import NavLinkButton from './NavLinkButton.mjs';

export default function Error404Page() {
    const {__} = useI18n();

    useEffect(() => {document.title = __('404 error') + ' - Photato'}, []);

    return <>
        <h1>{__('404 error')}</h1>
        <p>{__('This page does not exist.')}</p>
        <p><NavLinkButton to='/'>{__('Return to the Photato main page.')}</NavLinkButton></p>
    </>;
}
