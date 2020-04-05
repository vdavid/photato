import {createElement} from '../../web_modules/react.js';

export default function FullPageLoadingIndicator() {
    return createElement('div', {id: 'fullPageLoadingIndicator'},
        createElement('div', {},
            createElement('div', {className:'spinner'}),
            createElement('div', {className:'logo'}),
        )
    );
}