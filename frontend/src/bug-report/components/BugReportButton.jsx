import React from 'react';
import {useI18n} from '../../i18n/components/I18nProvider.jsx';
import {NavLink} from 'react-router-dom';

export default function BugReportButton() {
    const {__} = useI18n();
    return <section className="bugReportButton">
        <NavLink to="/bug-report">{__('Found a bug?')}</NavLink>
    </section>;
}
