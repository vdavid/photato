import LoadingPage from '../app/components/LoadingPage.mjs';
import AuthenticatedFrontPage from './AuthenticatedFrontPage.mjs';
import UnauthenticatedFrontPage from './UnauthenticatedFrontPage.mjs';
import {createElement} from '/web_modules/react.js';
import {useAuth0} from '../app/react-auth0-spa.mjs';
import {useI18n} from '../i18n/components/I18nProvider.mjs';

export default function FrontPage() {
    const {loading: isLoading, isAuthenticated} = useAuth0();
    const {areTranslationsLoaded} = useI18n();

    return createElement('section', {className: 'welcomePage'},
        ((isLoading || !areTranslationsLoaded)
                ? createElement(LoadingPage)
                : (isAuthenticated
                    ? createElement(AuthenticatedFrontPage)
                    : createElement(UnauthenticatedFrontPage))
        )
    );
}