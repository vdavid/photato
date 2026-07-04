import React from '../../web_modules/react.js';
import {useI18n} from '../../i18n/components/I18nProvider.mjs';
import {NavLink} from '../../web_modules/react-router-dom.js';

export default function BugReportButton() {
    const {__} = useI18n();
    return <section className="bugReportButton">
        <NavLink to="/bug-report">{__('Found a bug?')}</NavLink>
    </section>;
}
