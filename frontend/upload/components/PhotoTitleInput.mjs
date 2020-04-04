import {createElement} from '../../web_modules/react.js';

/**
 * @param {{title: string, isDisabled: boolean, onChange: function(string): void}} props
 * @returns {*}
 * @constructor
 */
export default function PhotoTitleInput(props) {
    const {title, isDisabled, onChange} = props;
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