import React from 'react';
import {useI18n} from '../../i18n/components/I18nProvider';

interface PhotoTitleInputProps {
    title: string;
    isDisabled: boolean;
    onChange: (title: string) => void;
}

export default function PhotoTitleInput({title, isDisabled, onChange}: PhotoTitleInputProps) {
    const {__} = useI18n();

    return <div className='title'>
        <input type='text'
               name='title'
               maxLength={150}
               placeholder={__('Give your photo a title (optional)')}
               disabled={isDisabled}
               value={title}
               onChange={event => onChange(event.target.value)}/>
    </div>;
}