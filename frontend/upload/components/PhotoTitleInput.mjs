import {createElement} from '../../web_modules/react.js';

/**
 *
 * @param {string} title
 * @param {boolean} isDisabled
 * @param {function(string): void} onChange
 * @returns {*}
 * @constructor
 */
export default function PhotoTitleInput({title, isDisabled, onChange}) {
    return createElement('div', {className: 'title'},
        createElement('input', {
            type: 'text',
            name: 'title',
            maxLength: 150,
            placeholder: 'Give your photo a title (optional)',
            disabled: isDisabled,
            value: title,
            onChange: event => onChange(event.target.value)
        })
    );
}