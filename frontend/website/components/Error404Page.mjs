import {createElement} from '../../web_modules/react.js';
import {useI18n} from '../../i18n/components/I18nProvider.mjs';
import {NavLink} from '../../web_modules/react-router-dom.js';

export default function Error404Page() {
    const {__} = useI18n();

    return [
        createElement('h1', {}, __('404 error')),
        createElement('p', {}, __('This page does not exist')),
        createElement(NavLink, {to: '/'}, __('Return to the Photato main page.')),
    ];
}
