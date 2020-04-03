import {createElement} from '../../web_modules/react.js';

/**
 * @param {{onFileSelected: function, isDisabled: boolean}} props
 * @constructor
 */
export default function FileSelectorWithPreview(props) {
    const {onFileSelected, isDisabled} = props;

    return createElement('input', {
        type: 'file',
        name: 'image',
        accept: 'image/*',
        onChange: onFileSelected,
        disabled: isDisabled,
    });
}