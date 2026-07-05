import React, {useEffect, useRef, useState} from 'react';
import {useI18n} from '../../i18n/components/I18nProvider';
import OrientationFixer from '../OrientationFixer';

interface FileSelectorWithPreviewProps {
    selectedFile: File | null;
    selectedFilePreviewUrl: string;
    onFileSelected: (file: File) => void;
    onFileRemoved: () => void;
    isDisabled: boolean;
}

export default function FileSelectorWithPreview({selectedFile, selectedFilePreviewUrl, onFileSelected, onFileRemoved, isDisabled}: FileSelectorWithPreviewProps) {
    const {__} = useI18n();
    const fileInputRef = useRef<HTMLInputElement>(null);
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

    const handleRemove = (event: React.MouseEvent) => {
        event.preventDefault();
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
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
            <input type='file' name='image' accept='image/jpeg' onChange={(event: React.ChangeEvent<HTMLInputElement>) => onFileSelected(event.target.files![0])} disabled={isDisabled} ref={fileInputRef}/>
        </div>
    </div>;
}