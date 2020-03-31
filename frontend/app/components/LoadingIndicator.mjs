import {createElement} from '/web_modules/react.js';

export const LoadingIndicator = () => {
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
};