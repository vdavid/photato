import React, {useEffect, useRef, useState} from '../../web_modules/react.js';
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
    }, [selectedFilePreviewUrl]);

    const handleRemove = event => {
        event.preventDefault();
        fileInputRef.current.value = '';
        onFileRemoved();
    };

    return <div className='imageFileSelector'>
        <div>{selectedFilePreviewUrl && !isImageLoading ?
            <div className='preview'>
                <img src={selectedFilePreviewUrl} style={{transform: orientationCss}} alt="Selected file"/>
            </div> : null}
            {selectedFilePreviewUrl && !isImageLoading &&
            <button className='removeButton' onClick={handleRemove} title='Remove photo'>x</button>}
            {!selectedFilePreviewUrl &&
            <div className='helpText'>
                <p>{__('Click here to select your photo, or drop your photo here')}</p>
            </div>}
            {isImageLoading &&
            <div className='loadingText'>
                <p>{__('Loading...')}</p>
            </div>}
            <input type='file' name='image' accept='image/jpeg' onChange={event => onFileSelected(event.target.files[0])} disabled={isDisabled} ref={fileInputRef}/>
        </div>
    </div>;
}