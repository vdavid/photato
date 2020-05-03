import React, {useEffect} from '../../web_modules/react.js';
import ChallengeList from './ChallengeList.mjs';
import {useI18n} from '../../i18n/components/I18nProvider.mjs';

export default function ChallengesPage() {
    const {__} = useI18n();

    useEffect(() => {document.title = __('Challenges') + ' - Photato'}, []);

    return <>
        <h1>{__('Challenges')}</h1>
        <ChallengeList/>
    </>;
}