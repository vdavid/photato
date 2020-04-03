import {createElement} from '/web_modules/react.js';

export default function LoadingIndicator() {
    return createElement('div', {className: 'lds-roller'},
        createElement('div'),
        createElement('div'),
        createElement('div'),
        createElement('div'),
        createElement('div'),
        createElement('div'),
        createElement('div'),
        createElement('div'),
    );
}