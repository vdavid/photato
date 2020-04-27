import {createElement, useEffect, useRef, useState} from '../../web_modules/react.js';
import {useI18n} from '../../i18n/components/I18nProvider.mjs';
import OrientationFixer from '../OrientationFixer.mjs';

/**
 * @param {File} selectedFile
 * @param {string} selectedFilePreviewUrl
 * @param {function(File): void} onFileSelected
 * @param {function(): void} onFileRemoved
 * @param {boolean} isDisabled
 * @returns {React.ReactElement}
 * @constructor
 */
export default function FileSelectorWithPreview({selectedFile, selectedFilePreviewUrl, onFileSelected, onFileRemoved, isDisabled}) {
    const {__} = useI18n();
    const fileInputRef = useRef(null);
    const [orientation, setOrientation] = useState(1);

    const [orientationFixer] = useState(new OrientationFixer());
    const orientationCss = orientationFixer.getCssTransformationByOrientationValue(orientation);
    const [isImageLoading, setIsImageLoading] = useState(false);

    useEffect(() => {
        async function updateOrientation() {
            if (selectedFile) {
                const orientation = await orientationFixer.determineOrientation(selectedFile);
                setOrientation(orientation);
            } else {
                setOrientation(1);
            }
            setIsImageLoading(false);
        }

        setIsImageLoading(true);
        // noinspection JSIgnoredPromiseFromCall
        updateOrientation();
    }, selectedFilePreviewUrl);

    return createElement('div', {className: 'imageFileSelector'},
        createElement('div', {},
            (selectedFilePreviewUrl && !isImageLoading) ? createElement('div', {className: 'preview'},
                createElement('img', {src: selectedFilePreviewUrl, style: {transform: orientationCss}}),
            ) : null,
            (selectedFilePreviewUrl && !isImageLoading) ? createElement('button', {
                className: 'removeButton',
                onClick: event => {
                    event.preventDefault();
                    fileInputRef.current.value = '';
                    onFileRemoved();
                },
                title: 'Remove photo'
            }, 'x') : null,
            !selectedFilePreviewUrl ? createElement('div', {className: 'helpText'},
                createElement('p', {}, __('Click here to select your photo, or drop your photo here')),
            ) : null,
            isImageLoading ? createElement('div', {className: 'loadingText'},
                createElement('p', {}, __('Loading...')),
            ) : null,
            createElement('input', {
                type: 'file',
                name: 'image',
                accept: 'image/jpeg',
                onChange: event => onFileSelected(event.target.files[0]),
                disabled: isDisabled,
                ref: fileInputRef,
            })
        ),
    );
}