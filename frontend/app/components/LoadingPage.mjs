import {createElement} from '/web_modules/react.js';
import {useI18n} from '../../i18n/components/I18nProvider.mjs';

export default function LoadingPage() {
    const {__} = useI18n();

    return createElement('h1', {}, __('Wait a second, the page is loading...'));
}