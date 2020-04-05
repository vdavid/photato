import {createElement} from '../../web_modules/react.js';
import {NavLink} from '../../web_modules/react-router-dom.js';
import {useI18n} from '../../i18n/components/I18nProvider.mjs';
import {weeklyChallengeTitles} from '../challengeRepository.mjs';

export default function ChallengesPage() {
    const {__} = useI18n();
    const weekIndexes = Array.from(Array(12), (value, key) => key + 1);
    const challengeLinks = weekIndexes.map(weekIndex => createElement('p', {},
        createElement(NavLink, {to: '/challenges/' + weekIndex}, __('Week {weekIndex}:', {weekIndex}) + ' ' + __(weeklyChallengeTitles[weekIndex - 1]))
    ));
    return createElement("div", {}, challengeLinks);
}