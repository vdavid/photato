import React, {useEffect} from '../../web_modules/react.js';
import {useI18n} from '../../i18n/components/I18nProvider.mjs';
import {NavLink} from '../../web_modules/react-router-dom.js';

export default function AdminPage() {
    const {__} = useI18n();

    useEffect(() => {
        document.title = 'Admin' + ' - Photato admin';
    }, []);

    return <>
        <p><NavLink to={'/admin/messages'}>{__('Messages')}</NavLink></p>
        <p><NavLink to={'/admin/sitemap-generator'}>{__('Sitemap generator')}</NavLink></p>
    </>;
}