import {createElement, useRef} from '../../web_modules/react.js';
import {useI18n} from '../../i18n/components/I18nProvider.mjs';

/**
 * @param {string} selectedFilePreviewUrl
 * @param {function(File): void} onFileSelected
 * @param {function(): void} onFileRemoved
 * @param {boolean} isDisabled
 * @returns {*}
 * @constructor
 */
export default function FileSelectorWithPreview({selectedFilePreviewUrl, onFileSelected, onFileRemoved, isDisabled}) {
    const {__} = useI18n();
    const fileInputRef = useRef(null);

    return createElement('div', {className: 'imageFileSelector'},
        createElement('div', {},
            selectedFilePreviewUrl ? createElement('div', {className: 'preview'},
                createElement('img', {src: selectedFilePreviewUrl}),
            ) : null,
            selectedFilePreviewUrl ? createElement('button', {
                className: 'removeButton',
                onClick: event => { event.preventDefault(); fileInputRef.current.value = ''; onFileRemoved(); },
                title: 'Remove photo'
            }, 'x') : null,
            !selectedFilePreviewUrl ? createElement('div', {className: 'helpText'},
                createElement('p', {}, __('Click here to select your photo, or drop your photo here')),
            ) : null,
            createElement('input', {
                type: 'file',
                name: 'image',
                accept: 'image/*',
                onChange: event => onFileSelected(event.target.files[0]),
                disabled: isDisabled,
                ref: fileInputRef,
            })
        ),
    );
}

